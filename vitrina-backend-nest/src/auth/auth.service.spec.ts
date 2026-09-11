import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  beforeEach(async () => {
    prisma = {
      usuario: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('el servicio debe existir', () => {
    expect(service).toBeDefined();
  });

  // ---------- HU-01: Registro ----------

  it('CP-16: debe registrar un usuario nuevo', async () => {
    const dto = {
      nombre: 'María Fernández',
      telefono: '3001234567',
      password: 'MiPassword123',
    };

    prisma.usuario.findUnique.mockResolvedValue(null);
    prisma.usuario.create.mockResolvedValue({
      id: 1,
      nombre: dto.nombre,
      telefono: dto.telefono,
      passwordHash: 'hash_falso',
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hash_falso');

    const resultado = await service.registrar(dto as any);

    expect(resultado.telefono).toBe('3001234567');
    expect(resultado).not.toHaveProperty('passwordHash');
  });

  it('CP-17: no debe registrar si el teléfono ya existe', async () => {
    const dto = {
      nombre: 'María Fernández',
      telefono: '3001234567',
      password: 'MiPassword123',
    };

    prisma.usuario.findUnique.mockResolvedValue({
      id: 1,
      telefono: '3001234567',
    });

    await expect(service.registrar(dto as any)).rejects.toThrow(
      'Ya existe una cuenta registrada con ese número de teléfono',
    );

    expect(prisma.usuario.create).not.toHaveBeenCalled();
  });

  // ---------- HU-02: Login ----------

  it('CP-18: debe devolver un token si las credenciales son correctas', async () => {
    const dto = {
      telefono: '3001234567',
      password: 'MiPassword123',
    };

    prisma.usuario.findUnique.mockResolvedValue({
      id: 1,
      telefono: '3001234567',
      passwordHash: 'hash_guardado',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.sign.mockReturnValue('token_falso');

    const resultado = await service.login(dto as any);

    expect(resultado).toEqual({ access_token: 'token_falso' });
  });

  it('CP-19: debe rechazar el login si la contraseña es incorrecta', async () => {
    const dto = {
      telefono: '3001234567',
      password: 'PasswordIncorrecta',
    };

    prisma.usuario.findUnique.mockResolvedValue({
      id: 1,
      telefono: '3001234567',
      passwordHash: 'hash_guardado',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login(dto as any)).rejects.toThrow(
      'Teléfono o contraseña incorrectos',
    );
  });
});