import { Typography } from "@mui/material";
import doubleQuoteStart from "../../img/doubleQuoteStart.png"
import doubleQuoteEnd from "../../img/doubleQuoteEnd.png"

const renderArticleText = (text: string | undefined) => {
    if (!text) return null;

    const formatText = (segment: string, index: number) => {
        segment = segment.replace(/\\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

        segment = segment.replace(/@(.*?)@/g, '<div style="text-align: center;">$1</div>');

        segment = segment.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');

        segment = segment.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        segment = segment.replace(/\*(.*?)\*/g, '<em>$1</em>');

        segment = segment.replace(/\$(.*?)\$/g, '<del>$1</del>');

        segment = segment.replace(/~(.*?)~/g, '<mark style="background-color: #B5CEBF;">$1</mark>');

        segment = segment.replace(/%(.*?)%/g, '<span style="color: #75857B;">$1</span>');

        segment = segment.replace(/#(.*?)#/g, (match, content) => {
            const lines = content.split('\n');
            const maxLength = Math.max(...lines.map((line: string | any[]) => line.length));
            const maxLineWidth = 300;
            let lineWidth = maxLength * 6;
            lineWidth = Math.min(lineWidth, maxLineWidth);

            const lineStyle = `border-top: 2px solid #75857B; width: ${lineWidth}px;`;
            const formattedContent = content.replace(/\\n/g, '<br />');

            return `
                <div style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
                    <div style="display: flex; align-items: center; justify-content: center; margin: 10px 0;">
                        <div style="${lineStyle} margin-right: 10px;"></div>
                        <img src="${doubleQuoteStart}" alt="Line Image" style="height: 30px;"/>
                        <div style="${lineStyle} margin-left: 10px;"></div>
                    </div>
                    <div style="margin: 10px 0; overflow-wrap: break-word; white-space: normal;">
                        <span style="display: inline-block; color: #75857B; text-align: center">${formattedContent}</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: center; margin: 10px 0;">
                        <div style="${lineStyle} margin-right: 10px;"></div>
                        <img src="${doubleQuoteEnd}" alt="Line Image" style="height: 30px;"/>
                        <div style="${lineStyle} margin-left: 10px;"></div>
                    </div>
                </div>
            `;
        });

        return <span key={index} dangerouslySetInnerHTML={{ __html: segment }} />;
    };

    const segments = text.split(/\n/);

    return segments.map((segment, index) => {
        if (segment.trim() === '') {
            return <br key={index} />;
        }
        return (
            <Typography
                key={index}
                paragraph
                sx={{
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    lineHeight: 1.6,
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                }}
            >
                {formatText(segment, index)}
            </Typography>
        );
    });
};

export default renderArticleText;