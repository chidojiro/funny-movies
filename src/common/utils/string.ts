import { PROJECT_CLASS_NAME_PREFIX } from '../constants';

const withProjectClassNamePrefix = (...classNames: string[]) => {
  return [classNames]
    .flat()
    .map(className => PROJECT_CLASS_NAME_PREFIX + className)
    .join(' ');
};

export const StringUtils = {
  withProjectClassNamePrefix,
};
