using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

class IconGen {
    static void Main() {
        int size = 1024;
        int padding = 130;
        var bmp = new Bitmap(size, size);
        var g = Graphics.FromImage(bmp);
        g.SmoothingMode = SmoothingMode.AntiAlias;
        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
        g.Clear(Color.FromArgb(255, 5, 5, 5));
        
        var logo = Image.FromFile(@"assets\logo.png");
        int avail = size - padding * 2;
        float scale = Math.Min((float)avail / logo.Width, (float)avail / logo.Height);
        int dw = (int)(logo.Width * scale);
        int dh = (int)(logo.Height * scale);
        int dx = (size - dw) / 2;
        int dy = (size - dh) / 2;
        g.DrawImage(logo, dx, dy, dw, dh);
        
        bmp.Save(@"assets\icon_1024.png", ImageFormat.Png);
        Console.WriteLine("OK: " + dw + "x" + dh + " at " + dx + "," + dy);
        g.Dispose(); bmp.Dispose(); logo.Dispose();
    }
}
