// src/utils/exportUtils.js

/**
 * Helper function to escape CSV fields.
 * This handles fields containing commas, quotes, or newlines.
 */
const escapeCsvField = (field) => {
  if (field === null || field === undefined) {
    return "";
  }
  let str = String(field);
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
};

/**
 * Exports an array of question objects to a CSV file.
 * @param {Array<Object>} questions - The array of question objects.
 * @param {string} filename - The desired filename (e.g., 'session_questions.csv').
 */
export const exportToCsv = (questions, filename = "questions.csv") => {
  if (!questions || questions.length === 0) {
    alert("No questions to export.");
    return;
  }

  // --- UPDATED SECTION ---
  // สร้าง Array ชุดใหม่และเรียงลำดับตามเวลา (เก่าสุด -> ใหม่สุด)
  // เราใช้ [...questions] เพื่อ copy array ก่อน sort จะได้ไม่กระทบ state เดิม
  const sortedQuestions = [...questions].sort((a, b) => {
    // new Date(a.createdAt) - new Date(b.createdAt) คือการเรียงจากน้อยไปมาก (เก่าไปใหม่)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
  // --- END UPDATED SECTION ---

  // Define headers
  const headers = ["CreatedAt", "ID", "Content", "Author", "Status", "Upvotes"];

  // Create header row
  const csvRows = [headers.join(",")];

  // Create data rows
  // --- UPDATED ---
  // เปลี่ยนจากวนลูป questions ธรรมดา มาใช้ sortedQuestions ที่เราเตรียมไว้
  sortedQuestions.forEach((q, index) => {
    const row = [
      escapeCsvField(new Date(q.createdAt).toLocaleString()),
      escapeCsvField(index + 1),
      escapeCsvField(q.content),
      escapeCsvField(q.author || "Anonymous"),
      escapeCsvField(q.status),
      escapeCsvField(q.upvotes),
    ];
    csvRows.push(row.join(","));
  });
  // --- END UPDATED ---

  // Join all rows with newline
  const csvString = csvRows.join("\n");

  // Create Blob with BOM (Byte Order Mark) for better Excel compatibility (UTF-8)
  const blob = new Blob(["\uFEFF" + csvString], {
    type: "text/csv;charset=utf-8;",
  });

  // Create a temporary link to trigger the download
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
