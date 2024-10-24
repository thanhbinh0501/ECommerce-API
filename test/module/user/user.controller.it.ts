import { ForbiddenException, INestApplication, NotFoundException } from '@nestjs/common';
import { closeTestApp, initializeTestApp } from '@test-setup/setup';
import request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { TokenProvider } from '@security/token-provider/token-provider';
import { UserRepository } from '@module/user/user.repository';
import { DataSource } from 'typeorm';
import { ApplicationConfig } from '@config/application.config';
import { ErrorCode } from '@share/constant/error-code';
import { UnauthorizedException } from '@exception/unauthorized.exception';
import { EncryptionUtil } from '@util/encryption.util';
import { ValidatorException } from '@exception/validator.exception';
import { UserBlueprint } from '@test-blueprint/user/user.blueprint';
import { User } from '@entity/user.entity';
import { DatabaseUtil } from '@test-util/database.util';
import { RequestUtil } from '@test-util/request.util';
import { UserRole } from '@entity/user-role.entity';
import { UserCreateReq } from '@module/user/dto/req/user-create.req';

describe('UserController Integration Test', () => {
  const baseUrl = ApplicationConfig.baseUrl;
  const authHeader = ApplicationConfig.auth.authHeader;

  let app: INestApplication;
  let moduleFixture: TestingModule;
  let httpServer: any;
  let tokenProvider: TokenProvider;
  let userRepository: UserRepository;
  let dataSource: DataSource;
  let superAdminAccessToken: string;
  let adminAccessToken: string;
  let userAccessToken: string;
  let admin1: User;
  let admin2: User;

  beforeAll(async () => {
    const testApp = await initializeTestApp();
    app = testApp.appInstance;
    moduleFixture = testApp.moduleFixture;
    httpServer = app.getHttpServer();
    dataSource = testApp.testDataSource;
    tokenProvider = moduleFixture.get<TokenProvider>(TokenProvider);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);

    superAdminAccessToken = tokenProvider.generateToken(1, ['SUPER_ADMIN']).accessToken;
    adminAccessToken = tokenProvider.generateToken(2, ['ADMIN']).accessToken;
    userAccessToken = tokenProvider.generateToken(3, ['USER']).accessToken;
  }, 180000);

  beforeEach(async () => {
    await DatabaseUtil.clearData(dataSource, UserRole);
    await DatabaseUtil.clearData(dataSource, User);
    await initData();
  });

  afterAll(async () => {
    await closeTestApp();
  });

  it('test_createUser_shouldBeOk', async () => {
    await request(httpServer)
      .post(`${baseUrl}/users`)
      .set(authHeader, superAdminAccessToken)
      .send({
        username: 'admin1',
        password: 'password',
        name: 'Admin1',
        roles: ['ADMIN'],
      } as UserCreateReq)
      .expect(201);
    const newUser = await userRepository.findOneBy({ username: 'admin1' });
    expect(newUser).toBeDefined();
    expect(newUser?.name).toEqual('Admin1');
  });

  it('test_createUser_withoutAuthHeader_shouldBeThrowUnauthorizedException', async () => {
    const res = await request(httpServer)
      .post(`${baseUrl}/users`)
      .send({
        username: 'admin1',
        password: 'password',
        name: 'Admin1',
        roles: ['ADMIN'],
      } as UserCreateReq)
      .expect(401);

    const body = res.body;
    expect(body.name).toEqual(UnauthorizedException.name);
    expect(body.errorCode).toEqual(ErrorCode.UNAUTHORIZED);
  });

  it('test_createUser_withUserAuthToken_shouldBeThrowForbiddenException', async () => {
    const res = await request(httpServer)
      .post(`${baseUrl}/users`)
      .set(authHeader, userAccessToken)
      .send({
        username: 'admin1',
        password: 'password',
        name: 'Admin1',
        roles: ['ADMIN'],
      } as UserCreateReq)
      .expect(403);
    const body = res.body;
    expect(body.name).toEqual(ForbiddenException.name);
    expect(body.errorCode).toEqual(ErrorCode.FORBIDDEN);
  });

  it('test_createUser_withExistedUsername_shouldBeThrowAlreadyExistException', async () => {
    const res = await request(httpServer)
      .post(`${baseUrl}/users`)
      .set(authHeader, superAdminAccessToken)
      .send({
        username: admin1.username,
        password: 'password',
        name: 'Admin',
        roles: ['ADMIN'],
      } as UserCreateReq)
      .expect(400);
    const body = res.body;
    expect(body.name).toEqual(ValidatorException.name);
    expect(body.errorCode).toEqual(ErrorCode.USER_ALREADY_EXIST);
  });

  it('test_searchUsers_shouldBeOk', async () => {
    const res = await request(httpServer)
      .get(`${baseUrl}/users`)
      .set(authHeader, superAdminAccessToken)
      .expect(200);
    const records = res.body.records;
    expect(records.length).toEqual(2);
    expect(records[0].name).toEqual(admin1.name);
    expect(records[1].name).toEqual(admin2.name);
  });

  it('test_searchUsers_withPagination_shouldBeOk', async () => {
    const res = await request(httpServer)
      .get(`${baseUrl}/users?${RequestUtil.generateQuery({ page: 1, pageSize: 1 })}`)
      .set(authHeader, superAdminAccessToken)
      .expect(200);
    const records = res.body.records;
    expect(records.length).toEqual(1);
    expect(records[0].name).toEqual(admin1.name);
  });

  it('test_searchUsers_withKeywordByName_shouldBeOk', async () => {
    const res = await request(httpServer)
      .get(`${baseUrl}/users?${RequestUtil.generateQuery({ keyword: admin2.name })}`)
      .set(authHeader, superAdminAccessToken)
      .expect(200);
    const records = res.body.records;
    expect(records.length).toEqual(1);
    expect(records[0].name).toEqual(admin2.name);
  });

  it('test_getCurrentUserProfile_shouldBeOk', async () => {
    const res = await request(httpServer)
      .get(`${baseUrl}/users/me`)
      .set(authHeader, adminAccessToken)
      .expect(200);
    expect(res.body.name).toEqual(admin2.name);
  });

  it('test_getUserById_shouldBeOk', async () => {
    const res = await request(httpServer)
      .get(`${baseUrl}/users/${admin2.id}`)
      .set(authHeader, superAdminAccessToken)
      .expect(200);
    expect(res.body.username).toEqual(admin2.username);
    expect(res.body.name).toEqual(admin2.name);
  });

  it('test_getUserById_withNotFoundUser_shouldBeThrowNotFoundException', async () => {
    const res = await request(httpServer)
      .get(`${baseUrl}/users/3`)
      .set(authHeader, superAdminAccessToken)
      .expect(404);
    const body = res.body;
    expect(body.name).toEqual(NotFoundException.name);
    expect(body.errorCode).toEqual(ErrorCode.NOT_FOUND);
  });

  it('test_changePassword_shouldBeOk', async () => {
    await request(httpServer)
      .put(`${baseUrl}/users/change-password`)
      .set(authHeader, adminAccessToken)
      .send({
        currentPassword: 'password',
        newPassword: 'newPassword',
      })
      .expect(204);
  });

  it('test_changePassword_withWrongCurrentPassword_shouldBeThrowValidatorException', async () => {
    const res = await request(httpServer)
      .put(`${baseUrl}/users/change-password`)
      .set(authHeader, adminAccessToken)
      .send({
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword',
      })
      .expect(400);
    const body = res.body;
    expect(body.name).toEqual(ValidatorException.name);
    expect(body.errorCode).toEqual(ErrorCode.WRONG_PASSWORD);
  });

  async function initData() {
    admin1 = UserBlueprint.create({
      id: 1,
      password: await EncryptionUtil.generateHash('password'),
    });
    admin2 = UserBlueprint.create({
      id: 2,
      password: await EncryptionUtil.generateHash('password'),
    });

    await userRepository.save([admin1, admin2]);
  }
});