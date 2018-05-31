///////////////////////////////////////////////////////////////////
// Random number stuff

// note... 0 inclusive to max exclusive
function randomInt(max)
{
    return Math.floor(Math.random() * max);
}

// note... inclusive to exclusive
function randomRangeInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomRangeFloat(min, max)
{
    return (Math.random() * (max - min)) + min;
}



///////////////////////////////////////////////////////////////////
// Filter stuff

var gammaConversion = gammaConversionCreateArray();

function gammaConversionCreateArray()
{
    // pre compute gamma conversions for performance
    // to do - what resolution is minimum?
    gca = new Array(10000);
    let power = 1.0 / 2.2;
    let delta = 1 / gca.length;
    let val = 0.0;
    for (let i = 0; i < gca.length; i++)
    {
        gca[i] = Math.pow(val, power);
        val += delta;
    }
    return gca;
}

// Value needs to be 0.0 - 1.0
// Can just cut/paste the code
function gammaConvert(value)
{
    return gammaConversion[Math.floor(value * gammaConversion.length)];
}
