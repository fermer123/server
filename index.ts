import index from './src/index';
import {port} from './src/constants/constants';

index.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
