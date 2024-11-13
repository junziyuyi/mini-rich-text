import { definePage } from '@vue-mini/core';

import { content } from './data';

definePage({
  setup() {
    return {
      content,
    };
  },
});
