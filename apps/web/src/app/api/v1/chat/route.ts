import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Xử lý POST request từ client
export async function POST(req: Request) {
  try {
    // Trích xuất mảng messages từ body
    const { messages } = await req.json();

    // Khởi tạo streaming với Gemini (mặc định dùng gemini-1.5-flash cho tốc độ nhanh)
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `Bạn là trợ lý AI chuyên môn về đào tạo ngôn ngữ trong nhà máy công nghiệp. 
Nhiệm vụ của bạn là giúp kỹ thuật viên và công nhân nhà máy học tiếng Trung và tiếng Anh chuyên ngành (An toàn, Lắp ráp, Máy móc, Bảo trì, v.v.).
Hãy luôn trả lời một cách lịch sự, dễ hiểu, ngắn gọn và tập trung vào ứng dụng thực tế trong xưởng. Nếu người dùng hỏi về từ vựng hay ngữ pháp, hãy giải thích bằng tiếng Việt kèm theo ví dụ (có Pinyin nếu là tiếng Trung).`,
      messages,
    });

    // Trả về stream object cho frontend
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Lỗi khi gọi AI API:', error);
    return new Response(JSON.stringify({ error: 'Đã có lỗi xảy ra khi gọi AI API.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
