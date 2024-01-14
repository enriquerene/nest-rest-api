import { Test, TestingModule } from '@nestjs/testing';
import { SmartLoggerService } from './smart-logger.service';

describe('SmartLoggerService', () => {
  let service: SmartLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartLoggerService],
    }).compile();

    service = module.get<SmartLoggerService>(SmartLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
