import fitz  # PyMuPDF
from pathlib import Path

def resize_and_center_pdf(input_pdf, output_pdf, target_width, target_height):
    doc = fitz.open(input_pdf)
    new_doc = fitz.open()  # Create a new PDF to store modifications

    for page in doc:
        # Create a blank new page with desired dimensions
        new_page = new_doc.new_page(width=target_width, height=target_height)

        # Calculate scale factors to maintain aspect ratio
        scale_x = target_width / page.rect.width
        scale_y = target_height / page.rect.height
        scale = min(scale_x, scale_y)

        # Calculate new dimensions
        new_width = page.rect.width * scale
        new_height = page.rect.height * scale

        # Calculate position to center vertically
        offset_x = (target_width - new_width) / 2
        offset_y = (target_height - new_height) / 2

        # Insert the original page into the new page, centered
        rect = fitz.Rect(offset_x, offset_y, offset_x + new_width, offset_y + new_height)
        new_page.show_pdf_page(rect, doc, page.number)

    new_doc.save(output_pdf)
    doc.close()
    new_doc.close()

def merge_pdfs_with_blanks(source_folder, output_file, target_width, target_height):
    paths = sorted(Path(source_folder).glob('*.pdf'))
    new_doc = fitz.open()  # Final document

    for path in paths:
        temp_output = "temp.pdf"
        resize_and_center_pdf(str(path), temp_output, target_width, target_height)

        # Load the temporary modified PDF and append its page
        temp_doc = fitz.open(temp_output)
        new_doc.insert_pdf(temp_doc)

        # Add a blank page after each PDF, if not the last one
        if path != paths[-1]:
            new_doc.new_page(width=target_width, height=target_height).draw_rect(fitz.Rect(0,0,target_width,target_height), color=(0, 0, 0), fill=(0, 0, 0))
        # Fill the page with black color
        # new_page.draw_rect(new_page.rect, color=(0, 0, 0), fill=(0, 0, 0))

        temp_doc.close()

    new_doc.save(output_file)
    new_doc.close()

# Configuration
source_folder = 'sample'
output_file = 'compiled_output.pdf'
# target_width, target_height = 832, 1216
target_width, target_height = 612, 792

# Process
merge_pdfs_with_blanks(source_folder, output_file, target_width, target_height)
