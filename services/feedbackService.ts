/**
 * 피드백 서비스 - Google Sheets에 사용자 피드백을 저장합니다.
 * ===============================================================
 * Google Apps Script를 사용하여 피드백을 Google Sheets에 저장합니다.
 * 
 * 사용 방법:
 * 1. Google Apps Script에서 새 프로젝트를 만듭니다.
 * 2. 아래 코드를 Apps Script에 붙여넣습니다.
 * 3. 배포 > 새 배포 > 웹 앱으로 배포합니다.
 * 4. 배포된 웹 앱 URL을 FEEDBACK_SCRIPT_URL에 설정합니다.
 */

// Google Apps Script URL - 실제 배포 후 URL로 교체해야 합니다
const FEEDBACK_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Google Sheets ID for feedback
const FEEDBACK_SHEET_ID = '171qfiFg8-SaOIZCMP2Y4bgsiAVIJ3hoFy5LKnwYT1gI';
const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${FEEDBACK_SHEET_ID}`;

export interface FeedbackData {
  email: string;
  content: string;
  page?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  feedbackId?: string;
}

/**
 * Google Apps Script 코드 (Apps Script에 복사하여 사용):
 * 
 * function doPost(e) {
 *   try {
 *     const data = JSON.parse(e.postData.contents);
 *     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *     
 *     // 헤더가 없으면 추가
 *     if (sheet.getLastRow() === 0) {
 *       sheet.getRange(1, 1, 1, 6).setValues([[
 *         'Timestamp', 'Type', 'Content', 'UserAgent', 'Page', 'FeedbackId'
 *       ]]);
 *     }
 *     
 *     const timestamp = new Date();
 *     const feedbackId = Utilities.getUuid();
 *     const userAgent = e.parameter.userAgent || 'Unknown';
 *     const page = data.page || 'Unknown';
 *     
 *     sheet.appendRow([
 *       timestamp,
 *       data.type,
 *       data.content,
 *       userAgent,
 *       page,
 *       feedbackId
 *     ]);
 *     
 *     return ContentService
 *       .createTextOutput(JSON.stringify({
 *         success: true,
 *         message: '피드백이 성공적으로 저장되었습니다.',
 *         feedbackId: feedbackId
 *       }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (error) {
 *     return ContentService
 *       .createTextOutput(JSON.stringify({
 *         success: false,
 *         message: '피드백 저장 중 오류가 발생했습니다: ' + error.toString()
 *       }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 */

/**
 * 피드백을 Google Sheets에 저장합니다.
 */
export async function submitFeedback(feedbackData: FeedbackData): Promise<FeedbackResponse> {
  try {
    // 현재는 로컬 스토리지에 저장 (개발 중)
    // 실제 Google Apps Script가 설정되면 아래 코드를 활성화하세요
    
    /*
    const response = await fetch(FEEDBACK_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: feedbackData.type,
        content: feedbackData.content,
        page: feedbackData.page || window.location.pathname,
        userAgent: navigator.userAgent
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    */
    
    // 임시 로컬 스토리지 저장
    const feedbackId = generateFeedbackId();
    const feedback = {
      id: feedbackId,
      timestamp: new Date(),
      email: feedbackData.email,
      content: feedbackData.content,
      userAgent: navigator.userAgent,
      page: feedbackData.page || window.location.pathname
    };
    
    // 로컬 스토리지에 저장
    const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('feedback', JSON.stringify(existingFeedback));
    
    console.log('피드백이 로컬에 저장되었습니다:', feedback);
    
    return {
      success: true,
      message: '피드백이 성공적으로 저장되었습니다! (로컬 저장)',
      feedbackId: feedbackId
    };
    
  } catch (error) {
    console.error('피드백 저장 오류:', error);
    return {
      success: false,
      message: '피드백 저장 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 피드백 ID를 생성합니다.
 */
function generateFeedbackId(): string {
  return 'feedback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 저장된 피드백을 조회합니다 (로컬 스토리지에서).
 */
export function getStoredFeedback(): any[] {
  try {
    return JSON.parse(localStorage.getItem('feedback') || '[]');
  } catch (error) {
    console.error('피드백 조회 오류:', error);
    return [];
  }
}

/**
 * 피드백을 초기화합니다.
 */
export function clearStoredFeedback(): void {
  localStorage.removeItem('feedback');
}
