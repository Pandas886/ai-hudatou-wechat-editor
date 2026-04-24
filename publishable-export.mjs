const DEFAULTS = {
  authorName: '胡大头',
  aiName: 'sootie',
  brandName: 'AI 胡大头',
  stickerImage: 'https://cdn.jsdelivr.net/gh/Pandas886/picx-images-hosting@master/20260424100743291.png',
  skipFirstTitle: true,
  omitSticker: true,
  ctaAsSpan: true,
};

function inlineFormat(text) {
  let formatted = text;
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<span class="highlight">$1</span>');
  formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return formatted;
}

export function normalizeLegacyIdentity(text, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  return text
    .replace(/关注不赶时间NORUSH/g, `关注${settings.brandName}`)
    .replace(/不赶时间NORUSH/g, settings.brandName)
    .replace(/norush · 不赶时间/g, settings.brandName)
    .replace(/NORUSH/g, settings.brandName)
    .replace(/\bCola\b/g, settings.aiName)
    .replace(/\bcola\b/g, settings.aiName)
    .replace(/不二/g, settings.authorName)
    .replace(/!\[sticker\]\(ip-avatar\.jpg\)/g, `![sticker](${settings.stickerImage})`);
}

export function parseSourceToBlocks(source, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  const src = normalizeLegacyIdentity(source, settings);
  const lines = src.split('\n');
  const blocks = [];
  let i = 0;
  let lastWasH1 = false;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      lastWasH1 = false;
      i++;
      continue;
    }

    if (trimmed.startsWith('```chat')) {
      const content = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        content.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: 'chat', lines: content });
      lastWasH1 = false;
      continue;
    }

    if (trimmed.startsWith('```quote')) {
      const content = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        content.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: 'quote', lines: content });
      lastWasH1 = false;
      continue;
    }

    if (trimmed.startsWith('```terminal')) {
      const content = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        content.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: 'terminal', lines: content });
      lastWasH1 = false;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push({ type: 'divider' });
      lastWasH1 = false;
      i++;
      continue;
    }

    let match = trimmed.match(/^# (.+)/);
    if (match) {
      blocks.push({ type: 'h1', html: inlineFormat(match[1]) });
      lastWasH1 = true;
      i++;
      continue;
    }

    match = trimmed.match(/^## (.+)/);
    if (match) {
      blocks.push({ type: 'h2', html: inlineFormat(match[1]) });
      lastWasH1 = false;
      i++;
      continue;
    }

    match = trimmed.match(/^### (.+)/);
    if (match) {
      blocks.push({ type: 'h3', html: inlineFormat(match[1]) });
      lastWasH1 = false;
      i++;
      continue;
    }

    match = trimmed.match(/^> (.+)/);
    if (match) {
      blocks.push({
        type: lastWasH1 ? 'subtitle' : 'blockquote',
        html: inlineFormat(match[1]),
      });
      lastWasH1 = false;
      i++;
      continue;
    }

    match = trimmed.match(/^!\[sticker\]\((.+?)\)/);
    if (match) {
      blocks.push({
        type: 'sticker',
        src: (!match[1] || match[1] === 'ip-avatar.jpg') ? settings.stickerImage : match[1],
        alt: `${settings.authorName} 贴纸`,
      });
      lastWasH1 = false;
      i++;
      continue;
    }

    match = trimmed.match(/^!\[([^\]]*)\]\((.+?)\)/);
    if (match) {
      const altFull = match[1] || '图片';
      const srcValue = match[2];
      let alt = altFull;
      let width = '100%';
      if (altFull.includes('|')) {
        const parts = altFull.split('|');
        alt = parts[0].trim() || '图片';
        width = parts[1].trim() || '100%';
      }
      blocks.push({
        type: 'image',
        alt,
        src: srcValue,
        width,
      });
      lastWasH1 = false;
      i++;
      continue;
    }

    match = trimmed.match(/^\[CTA:(.+?)\]\((.+?)\)\{(\w+)\}/);
    if (match) {
      blocks.push({
        type: 'cta',
        text: match[1],
        url: match[2],
        variant: match[3],
      });
      lastWasH1 = false;
      i++;
      continue;
    }

    blocks.push({ type: 'paragraph', html: inlineFormat(line) });
    lastWasH1 = false;
    i++;
  }

  return blocks;
}

function renderChatBlock(lines, options) {
  const settings = { ...DEFAULTS, ...options };
  let html = '<div style="margin:0 0 24px;padding:14px 12px;border-radius:12px;background:#fafafa;">';
  html += `<p style="margin:0 0 12px;font-size:11px;color:#666;text-align:center;font-weight:600;">${settings.aiName} · Chat</p>`;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const colonCn = trimmed.indexOf('：');
    const colonEn = trimmed.indexOf(':');
    let splitIdx = -1;
    if (colonCn !== -1 && colonEn !== -1) splitIdx = Math.min(colonCn, colonEn);
    else if (colonCn !== -1) splitIdx = colonCn;
    else if (colonEn !== -1) splitIdx = colonEn;
    if (splitIdx === -1) return;

    const role = trimmed.substring(0, splitIdx).trim().toLowerCase();
    const text = inlineFormat(trimmed.substring(splitIdx + 1).trim());
    const isRight = role === '我' || role === 'me';
    const name = isRight ? settings.authorName : settings.aiName;

    html += `<div style="margin:0 0 10px;text-align:${isRight ? 'right' : 'left'};">`;
    html += `<p style="margin:0 0 4px;font-size:10px;color:#999;">${name}</p>`;
    html += `<span style="display:inline-block;max-width:82%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.55;text-align:left;${isRight ? 'background:#F4D758;color:#1a1a1a;' : 'background:#2B7FD8;color:#fff;'}">${text}</span>`;
    html += '</div>';
  });

  html += '</div>';
  return html;
}

function renderQuoteBlock(lines) {
  let label = '';
  let text = '';
  let source = '';

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('label:')) label = trimmed.substring(6).trim();
    else if (trimmed.startsWith('text:')) text = trimmed.substring(5).trim();
    else if (trimmed.startsWith('source:')) source = trimmed.substring(7).trim();
  });

  return (
    '<div style="margin:0 0 24px;padding:16px 18px;border-radius:14px;background:#2B7FD8;color:#fff;">' +
      (label ? `<p style="margin:0 0 8px;font-size:10px;color:#d7e8fb;text-transform:uppercase;">${label}</p>` : '') +
      (text ? `<p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#fff;">${text}</p>` : '') +
      (source ? `<p style="margin:0;font-size:10px;color:#d7e8fb;text-align:right;">${source}</p>` : '') +
    '</div>'
  );
}

function renderTerminalBlock(lines) {
  let prompt = 'sootie --think';
  let text = '';
  let footer = DEFAULTS.brandName;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('prompt:')) prompt = trimmed.substring(7).trim();
    else if (trimmed.startsWith('text:')) text = trimmed.substring(5).trim();
    else if (trimmed.startsWith('footer:')) footer = trimmed.substring(7).trim();
  });

  return (
    '<div style="margin:0 0 24px;padding:16px 18px;border-radius:12px;background:#1a1a1a;color:#fff;">' +
      `<p style="margin:0 0 10px;font-size:11px;color:#8f8f8f;font-family:Menlo,Consolas,monospace;line-height:1.5;">▸ ${prompt}</p>` +
      `<p style="margin:0;font-size:17px;line-height:1.6;color:#fff;font-family:Menlo,Consolas,monospace;">${text}</p>` +
      `<p style="margin:12px 0 0;font-size:10px;color:#8f8f8f;font-family:Menlo,Consolas,monospace;text-transform:uppercase;">${footer}</p>` +
    '</div>'
  );
}

function renderImageBlock(block, options) {
  const settings = { ...DEFAULTS, ...options };
  if (settings.omitSticker && block.type === 'sticker') return '';

  if (block.type === 'sticker') {
    return `<img alt="${block.alt}" src="${block.src}" style="max-width:120px;width:120px;border-radius:16px;display:block;margin:0 auto 24px;">`;
  }

  const width = block.width && block.width !== '100%' ? `width:${block.width};` : '';
  return `<img alt="${block.alt}" src="${block.src}" style="${width}max-width:100%;border-radius:8px;display:block;margin:0 auto 24px;">`;
}

function renderCtaBlock(block, options) {
  const settings = { ...DEFAULTS, ...options };
  const variantStyle = block.variant === 'blue'
    ? 'background:#2B7FD8;color:#fff;'
    : 'background:#F4D758;color:#1a1a1a;';
  const content = `${block.text} →`;

  if (settings.ctaAsSpan) {
    return `<p style="margin:0 0 24px;text-align:center;"><span style="display:inline-block;padding:10px 28px;border-radius:24px;${variantStyle}font-size:13px;font-weight:600;">${content}</span></p>`;
  }

  return `<p style="margin:0 0 24px;text-align:center;"><a href="${block.url}" style="display:inline-block;padding:10px 28px;border-radius:24px;${variantStyle}font-size:13px;font-weight:600;text-decoration:none;">${content}</a></p>`;
}

export function buildPublishableHtml(source, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  const blocks = parseSourceToBlocks(source, settings);
  let html = '<div style="padding:24px 16px;color:#1a1a1a;font-size:14px;line-height:1.75;">';
  let skippedFirstTitle = !settings.skipFirstTitle;

  blocks.forEach((block) => {
    switch (block.type) {
      case 'h1':
        if (!skippedFirstTitle) {
          skippedFirstTitle = true;
          return;
        }
        html += `<h1 style="margin:0 0 24px;font-size:30px;line-height:1.35;font-weight:700;">${block.html}</h1>`;
        break;
      case 'h2':
        html += `<h2 style="margin:0 0 24px;padding:0 0 8px;font-size:22px;line-height:1.4;font-weight:700;color:#1a1a1a;border-bottom:3px solid #F4D758;display:inline-block;">${block.html}</h2>`;
        break;
      case 'h3':
        html += `<h3 style="margin:0 0 24px;padding-left:12px;border-left:3px solid #2B7FD8;font-size:16px;line-height:1.4;font-weight:600;color:#1a1a1a;">${block.html}</h3>`;
        break;
      case 'subtitle':
        html += `<p style="margin:14px 0 24px;color:#888;line-height:1.5;">${block.html}</p>`;
        break;
      case 'blockquote':
        html += `<p style="margin:0 0 24px;padding-left:14px;border-left:3px solid #e8e4dc;color:#555;line-height:1.65;font-style:italic;">${block.html}</p>`;
        break;
      case 'paragraph':
        html += `<p style="margin:0 0 24px;">${block.html}</p>`;
        break;
      case 'divider':
        html += '<hr style="border:none;border-top:1px solid #e8e4dc;margin:0 0 24px;">';
        break;
      case 'chat':
        html += renderChatBlock(block.lines, settings);
        break;
      case 'quote':
        html += renderQuoteBlock(block.lines);
        break;
      case 'terminal':
        html += renderTerminalBlock(block.lines);
        break;
      case 'cta':
        html += renderCtaBlock(block, settings);
        break;
      case 'image':
      case 'sticker':
        html += renderImageBlock(block, settings);
        break;
      default:
        break;
    }
  });

  html += '</div>';
  return html;
}

export function buildPublishableFilename(source, fallback = `wechat-publish-${new Date().toISOString().slice(0, 10)}`) {
  const blocks = parseSourceToBlocks(source);
  const firstTitle = blocks.find((block) => block.type === 'h1');
  const raw = firstTitle ? firstTitle.html.replace(/<[^>]+>/g, '').trim() : fallback;
  const safe = raw.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim() || fallback;
  return `${safe}.wechat-mp-draft.html`;
}
