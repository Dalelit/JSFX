// https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

//
// to do
// - have it work over a texture

let wcnvs = null;
let wctx = null;
let water_buffer1 = null;
let water_buffer2 = null;
let water_image = null;
let gammaConversion = null;

function water_drops_onclick(canvas, event)
{
    if (wcnvs == null)
    {
        water_drops_initalise(canvas);
    }

    water_buffer1[event.offsetY * wcnvs.width + event.offsetX] = 1.0;
}

function water_drops_initalise(canvas)
{
    wcnvs = canvas;
    wctx = wcnvs.getContext("2d");

    let buffer_len = wcnvs.width * wcnvs.height;
    water_buffer1 = [];
    water_buffer2 = [];
    for (let i = 0; i < buffer_len; i++) water_buffer1[i] = water_buffer2[i] = 0.0;

    water_image = wctx.createImageData(wcnvs.width, wcnvs.height);

    // pre compute gamma conversions for performance
    // to do - what resolution is minimum?
    gammaConversion = new Array(10000);
    let power = 1.0 / 2.2;
    let delta = 1 / gammaConversion.length;
    let val = 0.0;
    for (let i = 0; i < gammaConversion.length; i++)
    {
        gammaConversion[i] = Math.pow(val, power);
        val += delta;
    }

    // start
    water_drops_animcation_loop();
}

function water_drops_copy_buffers()
{
    let x = y = 1;
    let xmax = wcnvs.width - 1;
    let ymax = wcnvs.height - 1;

    while (y < ymax)
    {
        x = 1;
        while (x < xmax)
        {
            let value = 0.0;
            value += water_buffer1[y * wcnvs.width + x+1];
            value += water_buffer1[y * wcnvs.width + x-1];
            value += water_buffer1[(y+1) * wcnvs.width + x];
            value += water_buffer1[(y-1) * wcnvs.width + x];
            value /= 2.0;

            let indx = y * wcnvs.width + x;
            water_buffer2[indx] = value - water_buffer2[indx]

            // dampening
            water_buffer2[indx] -= water_buffer2[indx] / 32;

            // to do - remove - here for testing.
            if (water_buffer2[indx] > 1.0)
            {
                console.log("Value > 1");
                water_buffer2[indx] = 1.0;
            }

            x++;
        }
        y++;
    }
}

function water_drops_render_buffer(buffer)
{
    let red = 255;
    let green = 255;
    let blue = 255;
    let alpha = 255;
    let indx = 0;

    for (let i = 0; i < buffer.length; i++)
    {
        // gamma correct first
        let b = gammaConversion[Math.floor(buffer[i] * gammaConversion.length)];
        water_image.data[indx++] = b * red;
        water_image.data[indx++] = b * green;
        water_image.data[indx++] = b * blue;
        water_image.data[indx++] = alpha;
    }

    wctx.putImageData(water_image, 0, 0);
}

let frame_count = 0;
function water_drops_animcation_loop()
{
    if (frame_count == 0)
    {
        water_drops_copy_buffers();

        // swap buffer
        let temp = water_buffer1;
        water_buffer1 = water_buffer2;
        water_buffer2 = temp;

        water_drops_render_buffer(water_buffer1);

        frame_count = 0;
    }
    else
    {
        frame_count--;
    }

    window.requestAnimationFrame(water_drops_animcation_loop);
}
