export function getTimeAgo(dateString) {
  if (!dateString) return '알 수 없음';

  const now = new Date(
    new Date().toLocaleString('en-US', {timeZone: 'Asia/Seoul'}) // 해당 줄 별도 추가 (국외 접속시 비교 기준 KST로 통일)
  );
  const posted = new Date(dateString);

  // 한국 시간 기준 보정 (CloudType에서 UTC 시간대 방지)
  const koreaTime = new Date(posted.toLocaleString('en-US', {timeZone: 'Asia/Seoul'}));

  // if (isNaN(posted)) return '알 수 없음'; {/* 팀 작업시 팀원이 작성 */}
  if (isNaN(koreaTime)) return '알 수 없음';

  const diff = Math.floor((now - koreaTime) / 1000);
  if (diff < 0) return '0초 전'; // 팀 작업시 팀원이 작성한 값: '미래'

  if (diff < 60) return `${diff}초 전`;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}개월 전`;
  return `${Math.floor(diff / 31536000)}년 전`;
}
