import pdf from 'pdf-parse';

export const parseCV = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        try {
          const data = await pdf(event.target.result as ArrayBuffer);
          resolve(data.text);
        } catch (error) {
          reject(error);
        }
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};
