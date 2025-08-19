'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, Send, Loader2, Lightbulb, TrendingUp, 
  AlertTriangle, CheckCircle, Minimize2, Maximize2,
  MessageCircle, Sparkles, Brain, Zap
} from 'lucide-react';
import { AIAnalysisAPIsService } from '@/services/apis/anthropic';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    insights?: string[];
    recommendations?: string[];
    score?: number;
    category?: string;
  };
}

interface AIAssistantWidgetProps {
  className?: string;
  defaultMinimized?: boolean;
  contextData?: {
    address?: string;
    selectedTools?: string[];
    analysisResults?: any;
  };
}

export function AIAssistantWidget({ 
  className = '',
  defaultMinimized = false,
  contextData
}: AIAssistantWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiService] = useState(() => new AIAnalysisAPIsService());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mensaje de bienvenida
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: '¡Hola! Soy tu asistente IA especializado en Web3 y SEO. Puedo ayudarte a analizar datos, generar insights y proporcionar recomendaciones personalizadas. ¿En qué puedo ayudarte?',
        timestamp: new Date(),
        metadata: {
          category: 'welcome'
        }
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Auto scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sugerencias contextuales
  const getContextualSuggestions = () => {
    const suggestions = [];
    
    if (contextData?.address) {
      suggestions.push(`Analiza la dirección ${contextData.address}`);
    }
    
    if (contextData?.selectedTools?.length) {
      suggestions.push(`Explica las herramientas seleccionadas: ${contextData.selectedTools.join(', ')}`);
    }
    
    if (contextData?.analysisResults) {
      suggestions.push('Resume los resultados del análisis');
      suggestions.push('¿Qué mejoras recomiendas?');
    }
    
    // Sugerencias generales
    suggestions.push('¿Cómo optimizar mi proyecto Web3?');
    suggestions.push('Explica las mejores prácticas de SEO Web3');
    suggestions.push('¿Qué métricas son más importantes?');
    
    return suggestions.slice(0, 4);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Preparar contexto para la IA
      const context = {
        address: contextData?.address,
        selectedTools: contextData?.selectedTools,
        analysisResults: contextData?.analysisResults,
        previousMessages: messages.slice(-5) // Últimos 5 mensajes para contexto
      };

      // Llamar al servicio de IA
      const response = await aiService.chatWithAI(userMessage.content, context);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: {
          insights: response.insights,
          recommendations: response.recommendations,
          score: response.score,
          category: response.category
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error al comunicarse con IA:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
        timestamp: new Date(),
        metadata: {
          category: 'error'
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
          {!isUser && (
            <div className="flex items-center gap-2 mb-1">
              <Bot className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-500">Asistente IA</span>
              {message.metadata?.category && (
                <Badge variant="outline" className="text-xs">
                  {message.metadata.category}
                </Badge>
              )}
            </div>
          )}
          
          <div className={`p-3 rounded-lg ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-900 border'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            
            {/* Metadata adicional para mensajes del asistente */}
            {!isUser && message.metadata && (
              <div className="mt-3 space-y-2">
                {message.metadata.score && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-gray-600">
                      Puntuación: {message.metadata.score}/100
                    </span>
                  </div>
                )}
                
                {message.metadata.insights && message.metadata.insights.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Lightbulb className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs font-medium text-gray-700">Insights:</span>
                    </div>
                    {message.metadata.insights.slice(0, 2).map((insight, index) => (
                      <div key={index} className="text-xs text-gray-600 pl-4">
                        • {insight}
                      </div>
                    ))}
                  </div>
                )}
                
                {message.metadata.recommendations && message.metadata.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs font-medium text-gray-700">Recomendaciones:</span>
                    </div>
                    {message.metadata.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-xs text-gray-600 pl-4">
                        • {rec}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-400 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
        
        {isUser && (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-2 order-1 flex-shrink-0">
            <span className="text-white text-xs font-medium">Tú</span>
          </div>
        )}
      </div>
    );
  };

  if (isMinimized) {
    return (
      <Card className={`fixed bottom-4 right-4 w-16 h-16 cursor-pointer hover:shadow-lg transition-all z-50 ${className}`}>
        <CardContent 
          className="p-0 h-full flex items-center justify-center"
          onClick={() => setIsMinimized(false)}
        >
          <div className="relative">
            <Bot className="h-6 w-6 text-blue-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-96 h-[500px] shadow-xl z-50 flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5 text-blue-500" />
              <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <CardTitle className="text-sm">Asistente IA Web3</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Claude
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3 min-h-0">
        {/* Área de mensajes */}
        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-4">
            {messages.map(renderMessage)}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Sugerencias */}
        {messages.length <= 1 && (
          <div className="py-3 border-t">
            <div className="text-xs text-gray-500 mb-2">Sugerencias:</div>
            <div className="grid grid-cols-1 gap-1">
              {getContextualSuggestions().slice(0, 2).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs h-8 justify-start text-left"
                >
                  <Zap className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input de mensaje */}
        <div className="flex gap-2 pt-3 border-t">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta sobre Web3, SEO, análisis..."
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

