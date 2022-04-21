import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllMailDto } from './dto/find-all-mail.dto';
import { SaveMailDto } from './dto/save-mail.dto';
import { MailStatusEnum } from './enum/mail-status.enum';
import { MailEntity } from './mail.entity';
import { MailService } from './mail.service';

describe('MailService', () => {
  let mailService: MailService;
  let mailRepository: Repository<MailEntity>;

  const getMany = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: getRepositoryToken(MailEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnThis(),
            andWhere: jest.fn(),
            getMany,
            findOneOrFail: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailRepository = module.get<Repository<MailEntity>>(getRepositoryToken(MailEntity));
  });

  afterEach(() => {
    getMany.mockRestore();
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
    expect(mailRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('shoud return a mail list with sucess', async () => {
      // Arrange
      const mailEntityMockList = [
        { id: '1', dueDate: '2022-04-01T12:00:00Z' },
        { id: '2', dueDate: '2022-04-01T12:00:00Z' },
      ] as MailEntity[];
      getMany.mockResolvedValueOnce(mailEntityMockList);
      // Act
      const result = await mailService.findAll();
      // Assert
      expect(result).toHaveLength(2);
    });

    it('should return a filtered mail list with dueDateLte', async () => {
      // Arrange
      const mailEntityMockList = [{ id: '2', dueDate: '2022-04-01T12:00:00Z' }] as MailEntity[];
      const params: Partial<FindAllMailDto> = { dueDateLte: '2022-04-01T12:00:00Z' };
      getMany.mockResolvedValueOnce(mailEntityMockList);
      // Act
      const result = await mailService.findAll(params);
      // Assert
      expect(result).toHaveLength(1);
    });

    it('should return a filtered mail list with WAITING status', async () => {
      // Arrange
      const mailEntityMockList = [{ id: '1', dueDate: '2022-04-01T12:00:00Z' }] as MailEntity[];
      const params: Partial<FindAllMailDto> = { status: MailStatusEnum.WAITING };
      getMany.mockResolvedValueOnce(mailEntityMockList);
      // Act
      const result = await mailService.findAll(params);
      // Assert
      expect(result).toHaveLength(1);
    });
  });

  describe('save', () => {
    it('should save a new mail with success', async () => {
      // Arrange
      const data: SaveMailDto = {
        destinationName: 'User',
        destinationAddress: 'user@email.com',
        dueDate: '2022-05-01T12:00:00Z',
        subject: 'Email test',
        body: '<p>Hi</p>',
      };
      const mailEntityMock = { ...data } as MailEntity;
      jest.spyOn(mailRepository, 'create').mockReturnValueOnce(mailEntityMock);
      jest.spyOn(mailRepository, 'save').mockResolvedValueOnce(mailEntityMock);
      // Act
      const result = await mailService.save(data);
      // Assert
      expect(result).toBeDefined();
      expect(mailRepository.create).toBeCalledTimes(1);
      expect(mailRepository.save).toBeCalledTimes(1);
    });
  });

  describe('updateStatus', () => {
    it('should update mail status with success', async () => {
      // Arrange
      const id = '1';
      // Act
      const result = await mailService.updateStatus(id, MailStatusEnum.SENT);
      // Assert
      expect(result).toBeUndefined();
    });
  });
});
