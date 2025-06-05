const themes = {
  dark: {
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    containerBackground: 'rgba(26, 26, 46, 0.9)',
    headerBackground: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    cardBackground: 'rgba(22, 33, 62, 0.8)',
    textColor: '#e4e4e7',
    mutedText: '#a1a1aa',
    accent: '#ffd700',
    secondary: '#ff6b6b',
    borderColor: '#374151',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    hoverShadow: '0 12px 40px rgba(255, 215, 0, 0.2)'
  },

  light: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    containerBackground: 'rgba(248, 250, 252, 0.95)',
    headerBackground: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
    cardBackground: 'rgba(255, 255, 255, 0.9)',
    textColor: '#1f2937',
    mutedText: '#6b7280',
    accent: '#3b82f6',
    secondary: '#8b5cf6',
    borderColor: '#d1d5db',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hoverShadow: '0 12px 40px rgba(59, 130, 246, 0.15)'
  },

  neon: {
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a1a1a 100%)',
    containerBackground: 'rgba(10, 10, 10, 0.95)',
    headerBackground: 'linear-gradient(135deg, #1a0a1a, #0a1a1a)',
    cardBackground: 'rgba(26, 10, 26, 0.8)',
    textColor: '#00ff88',
    mutedText: '#00cc66',
    accent: '#ff0088',
    secondary: '#00ffff',
    borderColor: '#ff0088',
    boxShadow: '0 8px 32px rgba(255, 0, 136, 0.3)',
    hoverShadow: '0 12px 40px rgba(0, 255, 136, 0.4)'
  },

  military: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d30 50%, #1a2332 100%)',
    containerBackground: 'rgba(26, 26, 26, 0.95)',
    headerBackground: 'linear-gradient(135deg, #2d2d30, #1a2332)',
    cardBackground: 'rgba(45, 45, 48, 0.8)',
    textColor: '#d4d4aa',
    mutedText: '#999966',
    accent: '#ffaa00',
    secondary: '#ff6600',
    borderColor: '#666633',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    hoverShadow: '0 12px 40px rgba(255, 170, 0, 0.3)'
  }
};

module.exports = { themes };