import os
from PIL import Image

def generate_lowres(src_dir, out_dir, ext=".webp", target_w=480, quality=50):
    os.makedirs(out_dir, exist_ok=True)
    files = sorted([f for f in os.listdir(src_dir) if f.endswith(".webp") or f.endswith(".jpg") or f.endswith(".png")])
    total = len(files)
    print(f"Generating low-res for {src_dir} -> {out_dir} ({total} frames)...")
    
    count = 0
    for f in files:
        count += 1
        src_path = os.path.join(src_dir, f)
        base_name = os.path.splitext(f)[0]
        out_path = os.path.join(out_dir, f"{base_name}.webp")
        
        try:
            with Image.open(src_path) as img:
                w, h = img.size
                target_h = int(h * (target_w / w))
                low_img = img.resize((target_w, target_h), Image.Resampling.BILINEAR)
                low_img.save(out_path, "WEBP", quality=quality, method=2)
        except Exception as e:
            print(f"Error processing {f}: {e}")
            
        if count % 60 == 0 or count == total:
            print(f"[{out_dir}] Processed {count}/{total} frames...")
            
    print(f"Done! Created {count} low-res frames in {out_dir}")

base = "/Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints_v2/public"

# 1. Villa sequence
generate_lowres(os.path.join(base, "sequence_villa"), os.path.join(base, "sequence_villa_low"), quality=50)

# 2. 3D walkthrough sequence
generate_lowres(os.path.join(base, "sequence"), os.path.join(base, "sequence_low"), quality=50)

# 3. Wall layering sequence
generate_lowres(os.path.join(base, "sequence_wall"), os.path.join(base, "sequence_wall_low"), quality=50)

print("All 3 low-res sequences generated successfully!")
