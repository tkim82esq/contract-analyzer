import mammoth from 'mammoth';

// Dynamic import for pdf-parse to avoid build issues
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const pdf = await import('pdf-parse');
    const data = await pdf.default(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  console.log(`Processing file: ${fileName}, type: ${fileType}`);
  
  try {
    // Handle text files
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    }
    
    // Handle Word documents (.docx)
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      const arrayBuffer = await file.arrayBuffer();
      
      try {
        // Convert ArrayBuffer to Buffer for mammoth
        const buffer = Buffer.from(arrayBuffer);
        
        // Use mammoth with buffer
        const result = await mammoth.extractRawText({
          buffer: buffer
        });
        
        if (result.value && result.value.trim()) {
          console.log(`Successfully extracted ${result.value.length} characters from Word document`);
          
          // Check if we got meaningful text
          if (result.value.length < 50) {
            console.warn('Extracted text seems too short, document might be empty');
          }
          
          return result.value;
        } else {
          throw new Error('No text content found in Word document');
        }
      } catch (mammothError) {
        console.error('Mammoth extraction error:', mammothError);
        
        // Try alternative extraction method using mammoth.convertToHtml
        try {
          const buffer = Buffer.from(arrayBuffer);
          const htmlResult = await mammoth.convertToHtml({ buffer: buffer });
          
          if (htmlResult.value) {
            // Strip HTML tags to get plain text
            const plainText = htmlResult.value
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (plainText.length > 0) {
              console.log('Extracted text using HTML conversion method');
              return plainText;
            }
          }
        } catch (htmlError) {
          console.error('HTML extraction also failed:', htmlError);
        }
        
        throw new Error(`Could not extract text from Word document`);
      }
    }
    
    // Handle old .doc format
    if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      throw new Error('Old .doc format is not fully supported. Please save your document as .docx or .txt format');
    }
    
    // Handle PDFs
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const text = await parsePDF(buffer);
      
      if (text && text.trim()) {
        console.log(`Successfully extracted ${text.length} characters from PDF`);
        return text;
      } else {
        throw new Error('No text content found in PDF');
      }
    }
    
    // For other file types, try to read as text
    console.log('Attempting to read as plain text for unknown file type');
    const text = await file.text();
    
    // Check if we got binary data (lots of special characters)
    const binaryCharCount = (text.match(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g) || []).length;
    if (binaryCharCount > text.length * 0.1) {
      throw new Error('File appears to contain binary data that cannot be read as text');
    }
    
    return text;
    
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error(`Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Clean up extracted text
export function cleanExtractedText(text: string): string {
  // Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Remove common artifacts from document conversion
  cleaned = cleaned.replace(/\[?PAGE\s*\d+\]?/gi, '');
  cleaned = cleaned.replace(/_{3,}/g, '');
  cleaned = cleaned.replace(/\*{3,}/g, '');
  
  // Fix common formatting issues
  cleaned = cleaned.replace(/([.!?])\s*([A-Z])/g, '$1 $2'); // Add space after sentence endings
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Reduce multiple line breaks
  cleaned = cleaned.replace(/\t+/g, ' '); // Replace tabs with spaces
  
  // Remove null characters and other control characters
  cleaned = cleaned.replace(/\x00/g, '');
  cleaned = cleaned.replace(/[\x01-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Fix spacing around punctuation
  cleaned = cleaned.replace(/\s+([.,;:!?])/g, '$1');
  cleaned = cleaned.replace(/([.,;:!?])(?=[A-Za-z])/g, '$1 ');
  
  return cleaned.trim();
}