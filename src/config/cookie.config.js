let cookieOption;

// 환경별로 cookie secure 옵션 적용
if (process.env.NODE_ENV === 'development') {
  cookieOption = {
    httpOnly: true,
    secure: false,
    sameSite: true,
  };
} else {
  cookieOption = {
    httpOnly: true,
    secure: true,
    sameSite: true,
  };
}

module.exports = {
  defaultCookieOption: {
    ...cookieOption,
  },
};
