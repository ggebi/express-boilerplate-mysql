import 'regenerator-runtime/runtime';
import request from 'supertest';
import app from '../app';

describe('/comments GET 테스트', () => {
  test('CHANNEL 댓글 조회 테스트', async () => {
    const res = await request(app)
      .get('/partner/v1/comments')
      .query({ type: 'channel', castId: 'youngjae@bbtv.com' });
    expect(res.statusCode).toBe(200);

    const result = JSON.parse(res.text);
    expect(result.code).toBe(2000);
    if (result.data.total >= 1) {
      expect(result.data.comments[0]).toEqual(
        expect.objectContaining({
          no: expect.any(Number),
          userNo: expect.any(Number),
          castId: expect.any(String),
          comment: expect.any(String),
          nickName: expect.any(String),
          createTime: expect.any(String),
        }),
      );
    }
  });

  test('LIVE 댓글 조회 테스트', async () => {
    const res = await request(app)
      .get('/partner/v1/comments')
      .query({ type: 'live', castCode: 'youngjae_1224' });
    expect(res.statusCode).toBe(200);

    const result = JSON.parse(res.text);
    expect(result.code).toBe(2000);
    if (result.data.total >= 1) {
      expect(result.data.comments[0]).toEqual(
        expect.objectContaining({
          no: expect.any(Number),
          userNo: expect.any(Number),
          castCode: expect.any(String),
          comment: expect.any(String),
          nickName: expect.any(String),
          createTime: expect.any(String),
        }),
      );
    }
  });
});

describe('/comments POST 테스트', () => {
  test('LIVE 댓글 등록 테스트', async () => {
    const res = await request(app)
      .post('/partner/v1/comments')
      .set('token', '{ "userNo": "140", "userId": "cheez.sian@gmail.com" }')
      .send({
        type: 'live',
        castId: 'youngjae@bbtv.com',
        castCode: 'youngjae_1224',
        message: 'jest test',
      });
    expect(res.statusCode).toBe(200);

    const result = JSON.parse(res.text);
    expect(result.code).toBe(2000);
    expect(result.msg).toEqual(expect.stringMatching(/\bsuccess\b/gi));
  });
});

describe('/comments DELETE 테스트', () => {
  test('댓글 삭제 성공', async () => {
    const res = await request(app)
      .delete('/partner/v1/comments/1005')
      .set('token', '{ "userNo": "140"}')
      .query({ type: 'channel' });

    const result = JSON.parse(res.text);
    expect(res.statusCode).toBe(200);
    expect(result.code).toBe(2000);
    expect(result.msg).toEqual(expect.stringMatching(/\bsuccess\b/gi));
  });

  test('이미 댓글이 삭제된 경우', async () => {
    const res = await request(app)
      .delete('/partner/v1/comments/1001')
      .set('token', '{ "userNo": "140"}')
      .query({ type: 'channel' });

    const result = JSON.parse(res.text);
    expect(res.statusCode).toBe(404);
    expect(result.code).toBe(4041);
  });
});
