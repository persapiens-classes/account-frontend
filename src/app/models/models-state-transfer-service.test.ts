import { StateTransferService } from './models-state-transfer-service';

describe('StateTransferService', () => {
  // Tipando o serviço com um objeto simples para os testes
  let service: StateTransferService<{ id: number; nome: string }>;

  beforeEach(() => {
    service = new StateTransferService();
  });

  it('deve inicializar com o estado nulo', () => {
    expect(service.getState()).toBeNull();
  });

  it('deve salvar e recuperar o estado corretamente', () => {
    const mockData = { id: 1, nome: 'Servidor Teste' };

    service.setState(mockData);

    expect(service.getState()).toEqual(mockData);
  });

  it('deve sobrescrever o estado anterior ao salvar um novo', () => {
    const estadoAntigo = { id: 1, nome: 'Antigo' };
    const estadoNovo = { id: 2, nome: 'Novo' };

    service.setState(estadoAntigo);
    service.setState(estadoNovo);

    expect(service.getState()).toEqual(estadoNovo);
  });
});
