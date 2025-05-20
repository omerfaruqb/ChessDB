import { createTableModel } from './model';
import { createTableService } from './service';

const tableModel = createTableModel();
const tableService = createTableService(tableModel);

export {  tableService }; 