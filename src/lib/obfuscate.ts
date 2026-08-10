const XOR_KEY = 47;

export function obfuscateLuaSource(code: string): string {
  const bytes = Buffer.from(code, "utf-8");
  let escaped = "";
  for (const b of bytes) {
    const x = b ^ XOR_KEY;
    escaped += "\\" + String(x).padStart(3, "0");
  }
  return [
    `local _s="${escaped}"`,
    `local _r={}`,
    `for i=1,#_s do _r[i]=string.char(bit32.bxor(string.byte(_s,i),${XOR_KEY})) end`,
    `loadstring(table.concat(_r))()`,
  ].join("\n");
}