import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm BillingBot 2.0 🤖 I can manage invoices, payments, reports and forecasts.",
      sender: 'bot',
      time: 'Now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    processBotResponse(input);
  };

  const handleQuickAction = (text) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text, sender: 'user', time: 'Now' }
    ]);
    processBotResponse(text);
  };

  const processBotResponse = (text) => {
    setIsTyping(true);
    const q = text.toLowerCase();

    setTimeout(() => {
      let reply =
        "I'm not sure about that yet. You can ask about invoices, revenue, GST, or reports.";

      if (q.includes('revenue') || q.includes('sales')) {
        reply =
          "📈 Your revenue this month is ₹4,82,500 (+18%). Forecast shows strong growth next month.";
      } else if (q.includes('invoice') && (q.includes('create') || q.includes('new'))) {
        reply =
          "🧾 Opening Invoice Editor. Want me to auto-fill customer & GST details?";
      } else if (q.includes('overdue') || q.includes('late')) {
        reply =
          "⚠️ You have 3 overdue invoices worth ₹78,200. Shall I send reminders?";
      } else if (q.includes('gst') || q.includes('tax')) {
        reply =
          "🇮🇳 GST summary ready. You have ₹18,900 payable this period.";
      }

      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: reply, sender: 'bot', time: 'Now' }
      ]);
      setIsTyping(false);
    }, 1300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">

          {/* Header */}
          <div className="bg-slate-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow">
                  <Bot size={20} />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <h3 className="text-white text-sm font-bold">
                  BillingBot Assistant
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Sparkles size={10} /> AI Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  <div className="text-[10px] text-right mt-1 opacity-70">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex">
                <div className="bg-white border p-3 rounded-2xl shadow flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 bg-slate-50 border-t flex gap-2 overflow-x-auto">
            <button onClick={() => handleQuickAction('Show Revenue')}
              className="chip">📊 Revenue</button>
            <button onClick={() => handleQuickAction('Create Invoice')}
              className="chip">🧾 Invoice</button>
            <button onClick={() => handleQuickAction('Overdue Payments')}
              className="chip">⚠️ Overdue</button>
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2 border-t bg-white">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask BillingBot..."
              className="flex-1 rounded-full px-4 py-2 bg-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl hover:scale-105 transition"
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
        {!isOpen && (
          <>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
          </>
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;
