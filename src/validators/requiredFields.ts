export const checkMissingFields = (body: any, requiredFields: string[]): string[] => {
    const missingFields = requiredFields.filter(field => !body[field]);
    return missingFields;
  };
  