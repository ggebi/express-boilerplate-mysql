let cookieOption;

// 환경별로 cookie secure 옵션 적용
if (process.env.NODE_ENV === 'develop') {
  cookieOption = {
    path: '/',
    httpOnly: true,
    sameSite: true,
  };
} else {
  cookieOption = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: true,
  };
}

module.exports = {
  accessExpireTime: 60 * 5,
  refreshExpireTime: 60 * 60 * 12,
  accessCookieOption: {
    ...cookieOption,
    maxAge: 1000 * 60 * 5,
  },
  refreshCookieOption: {
    ...cookieOption,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  tmpCookieOption: {
    ...cookieOption,
    maxAge: 1000 * 60 * 10,
  },
};
