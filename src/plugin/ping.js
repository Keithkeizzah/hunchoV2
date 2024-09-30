import config from '../../config.cjs';

const ping = async (m, sock) => {
  const prefix = config.PREFIX;
const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "ping") {
    const start = new Date().getTime();
    await m.React('⚪');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    const text = `*𝐇𝐔𝐍𝐂𝐇𝐎 𝐒𝐏𝐄𝐄𝐃: ${responseTime.toFixed(2)} s*`;
    sock.sendMessage(m.from, { text }, { quoted: m });
  }
}

export default ping;
