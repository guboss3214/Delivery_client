import { useLazyGetProductByIdQuery, useGetRecommendMutation } from "@/store/apiSlice";
import { Send, X } from "lucide-react";
import { useState, useRef, useEffect } from "react"
import RecommendedProduct from "./RecommendedProduct";

export default function Chat({isChatOpen, setIsChatOpen}: {isChatOpen: boolean, setIsChatOpen: (value: boolean) => void}) {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; product?: any }[]>([
        { role: 'assistant', content: 'Hello! How can I help you with your order today?' }
    ])
    const [input, setInput] = useState('')
    const [getRecommend] = useGetRecommendMutation()
    const [getProductById] = useLazyGetProductByIdQuery()
    const [isLoading, setIsLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        const userMessage = { role: 'user' as const , content: input };
        
        setMessages(prev => [...prev, userMessage]);
        setInput('')
        setIsLoading(true)
        try {
            const newHistory = [...messages, userMessage];
            const res = await getRecommend({history: newHistory}).unwrap()
            let productData = undefined;
            if (res.recommendedId) {
                try {
                    productData = await getProductById(res.recommendedId).unwrap();
                } catch (e) {
                    console.error("Failed to fetch recommended product", e);
                }
            }
            setMessages(prev => [...prev, { role: 'assistant', content: res.message, product: productData }])
        } catch (err) {
            console.error("Error:", err);
            setMessages(prev => [
                ...prev, 
                { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);
    return (
        <div className='fixed bottom-20 right-4 md:right-8 z-50 bg-white rounded-lg shadow-lg w-72 h-96 md:w-80 md:h-96 border border-gray-200 flex flex-col'>
            <div className='bg-emerald-500 text-white p-3 rounded-t-lg flex justify-between items-center'>
                <h2 className='font-semibold'>AI Assistant</h2>
                <button
                    onClick={() => setIsChatOpen(false)}
                    className='text-white hover:text-gray-200 cursor-pointer'
                >
                    <X className='h-5 w-5' />
                </button>
            </div>
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                {msg.content}
                            </div>
                        </div>
                        {msg.product && (
                            <RecommendedProduct product={msg.product} />
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className='flex justify-start'>
                        <div className='max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900'>
                            <div className='animate-pulse'>
                                <div className='h-2 w-2 bg-gray-400 rounded-full inline-block mr-1'></div>
                                <div className='h-2 w-2 bg-gray-400 rounded-full inline-block mr-1'></div>
                                <div className='h-2 w-2 bg-gray-400 rounded-full inline-block'></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            <div className='p-3 border-t border-gray-200'>
                <div className='flex space-x-2'>
                    <input
                        type='text'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder='Type your message...'
                        className='flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    />
                    <button
                        onClick={handleSend}
                        disabled={input.trim().length === 0}
                        className={`bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors ${input.trim().length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Send className='h-5 w-5' />
                    </button>
                </div>
            </div>
        </div>
    )
}