import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Comment Generator for Teachers
app.post("/api/gemini/generate-comment", async (req, res) => {
  try {
    const { studentName, attitudeTags, studyTags, strengths, improvements, currentWeek } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback generator when API key is not yet set
      const attitudeStr = attitudeTags?.length ? attitudeTags.join(", ") : "có ý thức học tập tốt";
      const studyStr = studyTags?.length ? studyTags.join(", ") : "nắm vững kiến thức";
      const improveStr = improvements || "cần tiếp tục phát huy và tự tin hơn khi thuyết trình";
      const strengthStr = strengths || "chăm chỉ, ngoan ngoãn và tích cực trong giờ học";

      const fallbackComment = `Trong ${currentWeek || "tuần này"}, em ${studentName} thể hiện thái độ ${attitudeStr}. Về học tập, em ${studyStr} và có điểm sáng là ${strengthStr}. Cô lưu ý em ${improveStr} để đạt kết quả toàn diện hơn.`;
      const fallbackParentTip = `Gia đình có thể cùng con dành 10-15 phút mỗi tối trò chuyện về bài học trên lớp và khích lệ con tự tin chia sẻ góc nhìn của mình.`;

      return res.json({
        comment: fallbackComment,
        parentTip: fallbackParentTip,
        isAiGenerated: false,
      });
    }

    const prompt = `
Bạn là cô giáo Vân Anh, Giáo viên chủ nhiệm Lớp 7C & Giáo viên môn Ngữ Văn Trường THCS Tân Khai.
Hãy viết nhận xét học sinh hàng tuần đầy đủ, tình cảm, sư phạm chuẩn mực, mang tính khích lệ và đồng hành, tránh rập khuôn máy móc.

Thông tin học sinh:
- Họ và tên: ${studentName || "Học sinh"}
- Tuần đánh giá: ${currentWeek || "Tuần hiện tại"}
- Thái độ học tập: ${attitudeTags?.join(", ") || "Tích cực"}
- Tình hình học tập: ${studyTags?.join(", ") || "Hoàn thành bài tập tốt"}
- Điểm mạnh nổi bật: ${strengths || "Chăm chỉ, hòa đồng"}
- Điểm cần cải thiện: ${improvements || "Cần mạnh dạn phát biểu hơn"}

Yêu cầu:
1. Viết đoạn nhận xét của GVCN (khoảng 3 - 5 câu): Văn phong sư phạm ấm áp, ghi nhận nỗ lực của con, chỉ ra rõ điểm mạnh và định hướng khắc phục nhẹ nhàng, khuyến khích con tiến bộ.
2. Viết 1 gợi ý ngắn gọn "Góc đồng hành cùng cha mẹ" (khoảng 2 câu): Hướng dẫn cụ thể, thực tế cha mẹ có thể làm ở nhà trong tuần này để hỗ trợ con.

Trả về định dạng JSON DUY NHẤT:
{
  "comment": "Nội dung nhận xét của GVCN...",
  "parentTip": "Gợi ý phối hợp cho cha mẹ..."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      parsedData = {
        comment: rawText,
        parentTip: "Gia đình tiếp tục động viên và đồng hành cùng con trong các hoạt động học tập hàng ngày.",
      };
    }

    return res.json({
      comment: parsedData.comment,
      parentTip: parsedData.parentTip,
      isAiGenerated: true,
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    // Fallback gracefully without breaking the UI
    const { studentName, attitudeTags, studyTags, strengths, improvements } = req.body;
    return res.json({
      comment: `Em ${studentName} có ý thức học tập tốt, ${attitudeTags?.join(", ") || "chăm chỉ"}. Em ${studyTags?.join(", ") || "nắm chắc bài học"}. Điểm mạnh: ${strengths || "tích cực"}. Cần lưu ý: ${improvements || "mạnh dạn hơn"}.`,
      parentTip: "Cha mẹ hãy dành thời gian trò chuyện, khen ngợi những tiến bộ nhỏ mỗi ngày của con.",
      isAiGenerated: false,
    });
  }
});

// AI Literature Comment & Feedback Generator for Teacher Vân Anh
app.post("/api/gemini/generate-literature-comment", async (req, res) => {
  try {
    const { studentName, score, testType, writingSkill, readingSkill, notes } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const scoreStr = score !== undefined && score !== null ? `${score}/10 điểm` : "đã hoàn thành";
      return res.json({
        feedback: `Em ${studentName} ${scoreStr} trong bài môn Ngữ Văn (${testType || 'Đọc hiểu & Viết đoạn'}). Kỹ năng cảm thụ và diễn đạt ${writingSkill || 'tương đối tốt'}. Cần tiếp tục rèn chữ viết nắn nót và ngắt câu chuẩn xác.`,
        guidance: `Khuyến khích con đọc thêm sách tham khảo 15 phút mỗi tối để làm phong phú thêm vốn từ ngữ.`,
        isAiGenerated: false,
      });
    }

    const prompt = `
Bạn là cô giáo Vân Anh, Giáo viên môn Ngữ Văn Lớp 7C Trường THCS Tân Khai.
Hãy viết nhận xét chuyên môn môn Ngữ Văn cho bài làm/tiến độ học của học sinh:
- Học sinh: ${studentName || "Học sinh"}
- Điểm số: ${score !== undefined && score !== null ? score + "/10" : "Đang đánh giá"}
- Hình thức/Bài kiểm tra: ${testType || "Kiểm tra định kỳ môn Ngữ Văn"}
- Kỹ năng viết & cảm thụ: ${writingSkill || "Tốt"}
- Kỹ năng đọc - hiểu văn bản: ${readingSkill || "Nắm chắc ý chính"}
- Ghi chú thêm: ${notes || "Có ý thức học tập tốt"}

Yêu cầu:
1. "feedback": Lời nhận xét chuyên môn Ngữ Văn của cô giáo (2-3 câu). Giàu cảm xúc, văn phong trong sáng, sư phạm, khen ngợi khả năng cảm thụ/lập luận và chỉ dẫn cụ thể (lỗi chính tả, câu từ, liên kết ý).
2. "guidance": Lời khuyên 1 câu thiết thực cho học sinh hoặc phụ huynh cùng rèn luyện tại nhà.

Trả về định dạng JSON:
{
  "feedback": "...",
  "guidance": "..."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      feedback: parsed.feedback || "Bài viết có tiến bộ, cần rèn luyện thêm cách dùng từ.",
      guidance: parsed.guidance || "Cùng con đọc sách 15 phút mỗi tối.",
      isAiGenerated: true,
    });
  } catch (error) {
    console.error("Literature comment error:", error);
    const { studentName, score, testType, writingSkill } = req.body;
    return res.json({
      feedback: `Em ${studentName} hoàn thành bài kiểm tra Ngữ Văn (${testType || 'bài làm'}). Kỹ năng diễn đạt ${writingSkill || 'tốt'}. Tiếp tục phát huy trong các bài học tới!`,
      guidance: "Dành thời gian đọc lại bài văn mẫu để mở rộng vốn từ.",
      isAiGenerated: false,
    });
  }
});

// AI Lesson Content & Homework Generator for Teacher Vân Anh
app.post("/api/gemini/generate-lesson-content", async (req, res) => {
  try {
    const { topic, week, title } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        keyKnowledge: "Nắm chắc giá trị nội dung và nghệ thuật của tác phẩm. Thực hành tiếng Việt: Phân tích hiệu quả của biện pháp tu từ được sử dụng.",
        homework: "1. Đọc kĩ lại văn bản và ghi nhớ các dẫn chứng chính.\n2. Viết đoạn văn cảm nhận 7-10 câu về hình ảnh thơ sâu sắc nhất.\n3. Soạn bài tiếp theo theo câu hỏi SGK.",
        sampleExcerpt: "Tác phẩm đã để lại trong lòng bạn đọc rung động sâu xa về vẻ đẹp tâm hồn con người Việt Nam bình dị, giàu lòng yêu nước...",
        isAiGenerated: false,
      });
    }

    const prompt = `
Bạn là cô giáo Vân Anh, Giáo viên môn Ngữ Văn Lớp 7C Trường THCS Tân Khai.
Hãy biên soạn nội dung bài học, trọng tâm kiến thức và dặn dò phụ huynh/học sinh lớp 7:
- Tuần học: ${week || 4}
- Tác phẩm/Văn bản: ${title || "Gặp lá cơm nếp (Thanh Thảo)"}
- Chủ đề: ${topic || "Khúc nhạc tâm hồn"}

Yêu cầu định dạng JSON:
{
  "keyKnowledge": "Trọng tâm kiến thức văn bản & phần Thực hành Tiếng Việt (khoảng 2-3 câu xúc tích)",
  "homework": "Nhiệm vụ bài tập về nhà và dặn dò phụ huynh đôn đốc con (3 gạch đầu dòng rõ ràng)",
  "sampleExcerpt": "Một đoạn văn mẫu tham khảo ngắn (khoảng 3-4 câu) gợi mở cảm xúc cho học sinh và phụ huynh"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      keyKnowledge: parsed.keyKnowledge,
      homework: parsed.homework,
      sampleExcerpt: parsed.sampleExcerpt,
      isAiGenerated: true,
    });
  } catch (error) {
    console.error("Lesson content generator error:", error);
    return res.json({
      keyKnowledge: "Nắm vững đặc điểm thể loại thơ, hình tượng nghệ thuật và các biện pháp tu từ.",
      homework: "1. Đọc và thuộc bài thơ.\n2. Viết đoạn văn cảm nhận 7-10 câu.\n3. Chuẩn bị bài học tiếp theo.",
      sampleExcerpt: "Hình tượng nghệ thuật trong tác phẩm giàu sức gợi, khơi dậy niềm trân trọng tình cảm gia đình thiêng liêng.",
      isAiGenerated: false,
    });
  }
});

// AI Parent Advice Generator (Góc đồng hành cha mẹ)
app.post("/api/gemini/parent-advice", async (req, res) => {
  try {
    const { studentName, topic, currentStatus } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        advice: `Cha mẹ hãy tạo không gian học tập yên tĩnh cho con ${studentName}, đặt các câu hỏi mở như 'Hôm nay ở lớp có điều gì thú vị nhất với con?' và đồng hành lắng nghe con chia sẻ.`,
        actionItem: "Lắng nghe con 15 phút mỗi tối không sử dụng điện thoại.",
        isAiGenerated: false,
      });
    }

    const prompt = `
Bạn là chuyên gia tâm lý giáo dục đồng hành cùng phụ huynh học sinh lớp 7 (độ tuổi 12-13 tuổi, giai đoạn dậy thì và định hình tính cách).
Học sinh: ${studentName}
Vấn đề phụ huynh quan tâm hoặc tình trạng của con: ${topic || currentStatus || "Phát triển sự tự tin và kỹ năng tự học"}

Hãy đưa ra lời khuyên thiết thực cho phụ huynh học sinh lớp 7:
1. Lời khuyên tâm lý & phương pháp tương tác nhẹ nhàng, tôn trọng (2-3 câu).
2. Một hành động cụ thể thực tế trong tuần (1 câu ngắn gọn).

Trả về định dạng JSON:
{
  "advice": "Lời khuyên...",
  "actionItem": "Hành động cụ thể..."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      advice: parsed.advice,
      actionItem: parsed.actionItem,
      isAiGenerated: true,
    });
  } catch (error) {
    console.error("Parent advice error:", error);
    return res.json({
      advice: "Cha mẹ hãy khuyến khích con bằng những lời khen cụ thể vào nỗ lực thay vì chỉ nhìn vào điểm số.",
      actionItem: "Cùng con thảo luận kế hoạch học tập tuần mới vào tối Chủ Nhật.",
      isAiGenerated: false,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
