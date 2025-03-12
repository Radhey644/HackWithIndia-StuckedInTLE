import React, { useState, useEffect } from 'react';
import { Brain, Send, Sparkles, Command, Image, Presentation, Music, Video, Code, History, Trash2, Star } from 'lucide-react';

// Define the type for our chat history items
interface ChatHistoryItem {
  prompt: string;
  result: string;
  model: string;
  timestamp: number;
  rating?: {
    score: number;
  };
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('all');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | null>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const aiModels = [
    { 
      id: 'all', 
      name: 'All Models', 
      icon: Brain,
      placeholder: 'What would you like to create? I can help with text, images, code, music, and more...'
    },
    { 
      id: 'presentation', 
      name: 'Presentation', 
      icon: Presentation,
      placeholder: 'Describe your presentation topic and key points you want to cover...'
    },
    { 
      id: 'image', 
      name: 'Image Generation', 
      icon: Image,
      placeholder: 'Describe the image you want to generate in detail...'
    },
    { 
      id: 'code', 
      name: 'Our Model', 
      icon: Code,
      placeholder: 'What would you like me to help you build or solve?'
    },
    { 
      id: 'music', 
      name: 'Music Generation', 
      icon: Music,
      placeholder: 'Describe the style, mood, and elements of the music you want to create...'
    },
    { 
      id: 'video', 
      name: 'Video Generation', 
      icon: Video,
      placeholder: 'Describe the video content, style, and duration you want to generate...'
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setResult('');
    setCurrentRating(null);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    let generatedResult = '';
    switch (selectedModel) {
      case 'presentation':
        generatedResult = `[Presentation Slides Generated]
1. Title Slide: "${prompt}"
2. Introduction
3. Key Points
4. Visual Elements
5. Conclusion`;
        break;
      case 'image':
        generatedResult = '[Generated Image Would Appear Here]';
        break;
      case 'code':
        generatedResult = '```javascript\n// Generated code based on prompt\nfunction example() {\n  console.log("Generated code");\n}\n```';
        break;
      case 'music':
        generatedResult = '[Generated Music Composition]';
        break;
      case 'video':
        generatedResult = '[Generated Video Content]';
        break;
      default:
        generatedResult = `Multi-modal AI Response:
• Text: Generated text response
• Image: Visual interpretation
• Code: Related code snippet
• Audio: Generated sound
• Video: Motion content`;
    }

    setResult(generatedResult);
    setIsGenerating(false);

    // Add to chat history
    const newHistoryItem: ChatHistoryItem = {
      prompt,
      result: generatedResult,
      model: selectedModel,
      timestamp: Date.now(),
    };
    setChatHistory(prev => [newHistoryItem, ...prev]);
  };

  const handleRating = (score: number) => {
    setCurrentRating(score);
    
    // Update the most recent history item with the rating
    setChatHistory(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[0] = {
          ...updated[0],
          rating: { score },
        };
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  const loadHistoryItem = (item: ChatHistoryItem) => {
    setPrompt(item.prompt);
    setSelectedModel(item.model);
    setResult(item.result);
    setCurrentRating(item.rating?.score || null);
    setShowHistory(false);
  };

  const renderRatingStars = (rating: number | undefined) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              (rating || 0) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Command className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Omni AI
              </span>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <History className="w-5 h-5 text-purple-400" />
              <span className="text-gray-200">History</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showHistory ? (
          <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Chat History</h2>
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            </div>
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No chat history yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => loadHistoryItem(item)}
                    className="bg-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-purple-400 font-medium">
                        {aiModels.find(model => model.id === item.model)?.name || 'All Models'}
                      </p>
                      <div className="flex items-center gap-4">
                        {item.rating && renderRatingStars(item.rating.score)}
                        <span className="text-sm text-gray-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-white mb-2 line-clamp-2">{item.prompt}</p>
                    <p className="text-gray-400 text-sm line-clamp-2">{item.result}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4">
                One Platform, Infinite Possibilities
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Access multiple AI models through a single, powerful interface. Transform your ideas into reality with Omni AI.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {aiModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                    selectedModel === model.id
                      ? 'bg-purple-500/20 border-2 border-purple-400'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <model.icon className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-gray-200">{model.name}</span>
                </button>
              ))}
            </div>

            <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-xl border border-white/10">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={aiModels.find(model => model.id === selectedModel)?.placeholder}
                  className="w-full h-32 bg-transparent text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-purple-400 rounded-xl resize-none p-4"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className={`absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    !prompt.trim() || isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 bg-black/30 rounded-2xl p-6 backdrop-blur-xl border border-white/10 min-h-[200px]">
              {result ? (
                <div>
                  <div className="text-gray-200 whitespace-pre-wrap mb-6">{result}</div>
                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300">Rate this response:</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => handleRating(score)}
                            className={`p-2 rounded-lg transition-colors ${
                              currentRating === score
                                ? 'bg-purple-500/30 text-purple-400'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <Star className={`w-5 h-5 ${
                              currentRating && score <= currentRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : ''
                            }`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <p>Your AI-generated content will appear here</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;