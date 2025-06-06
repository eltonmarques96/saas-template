const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'mocked-id' });

const createTransportMock = jest.fn().mockReturnValue({
  sendMail: sendMailMock,
});

export default {
  createTransport: createTransportMock,
  // exportar o mock para poder verificar nos testes
  __sendMailMock: sendMailMock,
};
