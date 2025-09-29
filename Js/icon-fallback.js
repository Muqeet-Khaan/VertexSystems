document.addEventListener('DOMContentLoaded', function () {
  // inject CSS for emoji fallback
  const css = `.symptom-emoji{font-size:2rem;display:block;margin:0 auto;color:inherit}.symptom-emoji.emoji-small{font-size:1.6rem}`;
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  const mappings = [
    {key: ['fatigue', 'tired'], emoji: '😴'},
    {key: ['jaundice', 'yellow', 'jaundic'], emoji: '🟡'},
    {key: ['abdominal', 'stomach', 'belly'], emoji: '🤢'},
    {key: ['nausea', 'vomit', 'vomiting'], emoji: '🤮'},
    {key: ['dark urine', 'urine'], emoji: '🟤'},
    {key: ['loss of appetite', 'loss appetite', 'appetite'], emoji: '🍽️'},
    {key: ['fever', 'temperature'], emoji: '🤒'},
    {key: ['joint', 'joint pain'], emoji: '🤕'},
    {key: ['cough'], emoji: '🤧'},
    {key: ['sore throat', 'throat'], emoji: '😷'},
    {key: ['body aches', 'aches', 'muscle'], emoji: '🤕'},
    {key: ['headache', 'headache'], emoji: '🤕'},
    {key: ['runny nose', 'nose', 'sneeze', 'sneezing'], emoji: '🤧'},
    {key: ['watery eyes', 'eyes'], emoji: '😢'},
    {key: ['shortness of breath', 'breath', 'lungs'], emoji: '😮‍💨'},
    {key: ['weight loss', 'weight'], emoji: '⚖️'}
  ];

  function findEmojiForText(text){
    if(!text) return '❓';
    const t = text.toLowerCase();
    for(const m of mappings){
      for(const k of m.key){
        if(t.indexOf(k) !== -1) return m.emoji;
      }
    }
    // if contains words like 'jaundice (sometimes)' -> contains jaundice
    return '❓';
  }

  // target all sections likely containing symptoms: id includes 'symptom' or heading text
  const symptomSections = Array.from(document.querySelectorAll('section')).filter(s => {
    if(s.id && s.id.toLowerCase().includes('symptom')) return true;
    const h = s.querySelector('h3, h2, h1');
    return h && /common symptoms/i.test(h.textContent || '');
  });

  symptomSections.forEach(section => {
    const items = section.querySelectorAll('.row .col-6, .row [class*=col-]');
    items.forEach(item => {
      const icon = item.querySelector('i');
      const textEl = item.querySelector('p, h6, span') || item;
      const text = textEl ? (textEl.textContent || '').trim() : '';

      // decide if FA icon failed to render: check font-family or computed width/height
      let failed = false;
      if(icon){
        try{
          const cs = window.getComputedStyle(icon);
          const rect = icon.getBoundingClientRect();
          // If icon has no width/height or font-family doesn't mention Font Awesome, treat as failed
          if(rect.width === 0 || rect.height === 0) failed = true;
          if(!/Font Awesome|FontAwesome|fa-/.test(cs.getPropertyValue('font-family'))) {
            // sometimes font-family is not informative; still allow
          }
        }catch(e){ failed = true; }
      } else {
        failed = true; // no <i> element, will insert emoji
      }

      if(failed){
        // remove existing <i> if present
        if(icon && icon.parentNode) icon.parentNode.removeChild(icon);
        // avoid duplicate insertion
        if(item.querySelector('.symptom-emoji')) return;
        const emoji = findEmojiForText(text);
        const span = document.createElement('span');
        span.className = 'symptom-emoji';
        span.textContent = emoji;
        // insert at the start of item
        item.insertBefore(span, item.firstChild);
        // add small size for certain layouts
        if(item.querySelector('p') && item.querySelector('p').classList.contains('mt-2')){
          span.classList.add('emoji-small');
        }
      }
    });
  });
});
