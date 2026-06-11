import sys
from PIL import Image

def zoom_transparent_logo(input_path, output_path, zoom_factor=2.0):
    img = Image.open(input_path).convert("RGBA")
    
    # Filter alpha channel to ignore faint shadows/glows when finding the bounding box
    alpha = img.split()[-1]
    # Make pixels with alpha > 50 fully opaque, others fully transparent
    bw_alpha = alpha.point(lambda p: 255 if p > 50 else 0)
    bbox = bw_alpha.getbbox()
    
    if not bbox:
        print("Image is entirely transparent.")
        return
        
    left, top, right, bottom = bbox
    
    center_x = (left + right) / 2
    center_y = (top + bottom) / 2
    
    width = right - left
    height = bottom - top
    max_dim = max(width, height)
    
    # Apply zoom factor: the new box size is max_dim / zoom_factor
    new_size = max_dim / zoom_factor
    
    new_left = center_x - new_size / 2
    new_top = center_y - new_size / 2
    new_right = center_x + new_size / 2
    new_bottom = center_y + new_size / 2
    
    # Crop the zoomed-in region
    cropped = img.crop((int(new_left), int(new_top), int(new_right), int(new_bottom)))
    
    # Resize to standard 512x512 size for browser icon
    final_img = cropped.resize((512, 512), Image.Resampling.LANCZOS)
    
    final_img.save(output_path, format="PNG")
    print(f"Zoomed transparent logo (x{zoom_factor}) saved to {output_path}")

if __name__ == '__main__':
    input_file = '/Users/vincee_ong/Desktop/vinceongwebsite/logowobackgroudn.png'
    output_file = '/Users/vincee_ong/Desktop/vinceongwebsite/vince-portfolio/app/icon.png'
    # The user asked to double in size
    zoom_transparent_logo(input_file, output_file, zoom_factor=2.0)
