import CreateFileService from '../../../src/modules/files/services/CreateFileService';
import FakeFilesRepository from '../../../src/modules/files/repositories/fakes/FakeFilesRepository';
import FakeStorageProvider from '../../../src/modules/files/providers/StorageProvider/fakes/FakeStorageProvider';

let fakeFilesRepository: FakeFilesRepository;
let fakeStorageProvider: FakeStorageProvider;
let createFile: CreateFileService;

describe('Create File Service', () => {
  beforeEach(() => {
    fakeFilesRepository = new FakeFilesRepository();
    fakeStorageProvider = new FakeStorageProvider();
    createFile = new CreateFileService(fakeStorageProvider, fakeFilesRepository);
  });

  it('should be able to create a new file', async () => {
    const file = await createFile.execute({ name: 'fileName.jpeg', path: 'filePath.jpeg' });

    expect(file).toHaveProperty('id');
  });
});
