// Content filter middleware for Safe Mode (minors under 18)

const SENSITIVE_TOPICS = [
  // Violence & Crime
  'violence', 'murder', 'kill', 'weapon', 'gun', 'bomb', 'terrorist', 'attack', 'assault',
  'crime', 'criminal', 'robbery', 'theft', 'rape', 'abuse', 'torture', 'gore', 'blood',
  
  // Adult Content
  'sex', 'sexual', 'porn', 'nude', 'naked', 'explicit', 'erotic', 'xxx', 'nsfw',
  
  // Drugs & Substances
  'drug', 'cocaine', 'heroin', 'meth', 'marijuana', 'weed', 'cannabis', 'addiction',
  'overdose', 'prescription abuse', 'substance abuse',
  
  // Self-Harm
  'suicide', 'self-harm', 'cutting', 'eating disorder', 'anorexia', 'bulimia',
  
  // Hate Speech
  'hate speech', 'racism', 'sexism', 'homophobia', 'transphobia', 'discrimination',
  'slur', 'offensive language',
];

const SENSITIVE_PATTERNS = new RegExp(
  SENSITIVE_TOPICS.map(word => `\\b${word}\\b`).join('|'), 
  'i'
);

function containsSensitiveContent(text) {
  return SENSITIVE_PATTERNS.test(text.toLowerCase());
}

function getSafeModeResponse(topic) {
  return {
    filtered: true,
    message: `🛡️ Safe Mode is ON. This topic may not be appropriate for minors. 

If you're working on a school project or have questions about serious topics, please:
• Talk to a parent, guardian, or teacher
• Use supervised resources appropriate for your age
• Ask an adult to help you research this topic safely

You can continue using Interlink AI for other questions!`
  };
}

// Middleware function
function contentFilterMiddleware(req, res, next) {
  const { prompt, safeMode } = req.body;
  
  // Only filter if Safe Mode is enabled
  if (safeMode === true || safeMode === 'true') {
    if (containsSensitiveContent(prompt)) {
      return res.json({
        response: getSafeModeResponse().message,
        filtered: true,
        model: 'Content Filter',
      });
    }
  }
  
  // Content is safe or Safe Mode is off
  next();
}

module.exports = { contentFilterMiddleware, containsSensitiveContent, getSafeModeResponse };
