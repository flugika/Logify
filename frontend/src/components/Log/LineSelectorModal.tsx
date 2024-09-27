import { ReactNode, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { Modal, Paper, Typography, Button, Box, IconButton, Stack, Avatar, Divider, styled, Tooltip } from "@mui/material";
import { LogInterface } from "../../interfaces/ILog";
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CancelIcon from '@mui/icons-material/Cancel';
import userLogo from "../../img/user.png";
import { saveAs } from 'file-saver';
import renderArticleText from "../utils/renderArticleText"
import { categories } from "../utils/categoryIcons";

interface LineSelectorProps {
    log: LogInterface | undefined;
    openModal: boolean;
    handleCloseModal: () => void;
    followerCount: number;
    formatThaiDate: (date: Date) => ReactNode;
}

const textStyle = {
    marginBottom: '0rem',
    lineHeight: '1.6',
    fontSize: '1rem',
    color: '#333',
    textAlign: 'justify',
    fontWeight: 'normal',
    fontStyle: 'normal',
};

const LineSelectorButton = styled(Button)({
    borderRadius: '50px',
    minWidth: '50px',
    minHeight: '50px',
    width: '50px', // Initial width for icon-only display
    padding: '0.5rem',
    textTransform: 'none',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'flex-start', // Aligns icon to the left
    alignItems: 'center',
    paddingLeft: '13px',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#4D8A65',
    color: '#F5FFFC',
    boxShadow: "2px 4px 4px rgba(1, 27, 10, 0.2), -2px -4px 4px rgba(255, 255, 255, 0.3)",
    transition: 'width 0.3s ease, background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease', // Smoother transition
    '& .button-label': {
        opacity: 0, // Initially hidden label
        transition: 'opacity 0.4s ease', // Fade in/out label transition
        marginLeft: '10px',
    },
    '&:hover .button-label': {
        opacity: 1, // Label appears on hover
    },
});

const LineSelectorModal: React.FC<LineSelectorProps> = ({ log, openModal, handleCloseModal, followerCount, formatThaiDate }) => {
    const [selectedLines, setSelectedLines] = useState<string[]>([]);

    useEffect(() => {
        setSelectedLines([]);
    }, [openModal])

    const formatDateTime = () => {
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
    };

    // จัดการการเลือกบรรทัด
    const handleSelectLine = (line: string) => {
        console.log(!selectedLines.some(selected => selected === line))
        if (selectedLines.includes(line)) {
            setSelectedLines(selectedLines.filter((selected) => selected !== line));
        } else {
            // ตรวจสอบว่ามีการเลือกบรรทัดอื่นที่มีข้อความเดียวกันหรือไม่
            if (!selectedLines.some(selected => selected === line)) {
                setSelectedLines([...selectedLines, line]);
            }
        }
    };

    // Function to clear selected lines
    const clearSelectedLines = () => {
        setSelectedLines([]);
    };

    const handleShareAsImage = () => {
        const node = document.getElementById('log-content'); // กำหนด ID ให้กับ Box ที่จะแปลงเป็นรูปภาพ

        html2canvas(node!, {
            scale: 3, // เพิ่มค่า scale เพื่อตั้งค่า DPI ที่สูงขึ้น
            useCORS: true, // รองรับการเรียกข้ามโดเมน (CORS)
            backgroundColor: null, // Set backgroundColor to null for transparency
        }).then((canvas: HTMLCanvasElement) => {
            canvas.toBlob((blob) => {
                if (blob) { // ตรวจสอบว่า blob ไม่เป็น null
                    saveAs(blob, `${log?.Title}-${log?.User?.Username}-${formatDateTime()}.png`); // เซฟภาพที่มีความละเอียดสูง
                } else {
                    console.error('Blob is null');
                }
            }, 'image/png');
        });
    };

    return (
        <Modal open={openModal} onClose={handleCloseModal} sx={{ overflowY: 'auto' }}>
            <Box sx={{ display: "flex", flexDirection: "column" }} onClick={handleCloseModal}>
                <Box sx={{ padding: { xs: '1rem', md: '2rem' }, maxWidth: { xs: "90%", md: '800px' }, minWidth: { xs: "90%", md: "800px" }, margin: '0 auto' }} onClick={(e) => e.stopPropagation()}>
                    <Paper
                        id="selected-paper"
                        elevation={3}
                        sx={{
                            padding: '2rem',
                            marginTop: '1rem',
                            position: 'relative',
                            maxWidth: '100%', // ให้ขนาดไม่เกินขนาดหน้าจอ
                            overflow: 'hidden', // ป้องกันการ overflow
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                position: 'absolute',
                                top: '1rem',
                                left: '1rem',
                            }}
                        >
                            <Tooltip title="Close">
                                <IconButton onClick={handleCloseModal} sx={{ width: "40px", height: "40px" }}>
                                    <CancelIcon sx={{ color: "#4D8A65" }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        {/* ปุ่ม Like และ Save */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                            }}
                        >
                            <Tooltip title="Clear all lines">
                                <IconButton onClick={clearSelectedLines} sx={{ width: "40px", height: "40px" }}>
                                    <ClearAllIcon sx={{ color: "#E36951" }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Share as image">
                                <IconButton onClick={handleShareAsImage} sx={{ width: "40px", height: "40px" }}>
                                    <ShareIcon sx={{ color: "#4D8A65" }} />
                                </IconButton>
                            </Tooltip>
                            <Stack direction="column" alignItems="center" spacing={0}>
                                <Tooltip title="Like">
                                    <IconButton >
                                        <ThumbUpOffAltIcon sx={{ color: "#E36951" }} />
                                    </IconButton>
                                </Tooltip>
                                <Typography sx={{ marginTop: "-8px", justifyContent: "center" }}>{log?.LikesCount}</Typography>
                            </Stack>
                            <Stack direction="column" alignItems="center" spacing={0}>
                                <Tooltip title="Save">
                                    <IconButton >
                                        <BookmarkBorderIcon sx={{ color: "#3DB068" }} />
                                    </IconButton>
                                </Tooltip>
                                <Typography sx={{ marginTop: "-8px", justifyContent: "center" }}>{log?.SavesCount}</Typography>
                            </Stack>
                        </Box>

                        {/* Header */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: { xs: 'flex-start', md: 'space-between' },
                                alignItems: { xs: 'flex-start', md: 'center' },
                                marginTop: "1.6rem",
                                marginBottom: "1rem",
                                padding: { xs: 1, md: 2 },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // maxWidth: '65%'
                                }}>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                        fontWeight: 'bold',
                                        marginBottom: { xs: '0.3rem', md: 0 },
                                        flex: 1, // Make sure the title takes available space
                                        maxWidth: "100%",
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        textAlign: 'left',
                                    }}
                                >
                                    {log?.Title}
                                </Typography>
                                {Object.entries(categories)
                                    .filter(([category, { ID }]) => ID === log?.CategoryID)  // Filter where ID matches log?.MoodID
                                    .map(([mood, { ID, Name, Icon }]) => (
                                        <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Box sx={{ display: "flex", alignItems: 'center', color: "#6C757D", }}>
                                                {Icon}</Box> {/* Display Icon */}
                                            < Box sx={{ color: "#6C757D", fontSize: { xs: '0.8rem', md: '1rem' } }}>{Name}</Box> {/* Display Name */}
                                        </div>
                                    ))
                                }
                            </Box>
                            <Box
                                sx={{
                                    mt: "1rem",
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: "center", // Align items vertically centered
                                    justifyContent: "center", // Center horizontally
                                    gap: 2,
                                    minWidth: "30%",
                                    height: "100%", // Make sure height is set appropriately
                                }}
                            >
                                <Avatar
                                    src={userLogo}
                                    alt={log?.User?.Username || 'User'}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '50%', // Ensure the avatar is circular
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start', // Keep this for text alignment
                                    }}
                                >
                                    <Typography variant="h6">
                                        {log?.User?.Username || 'Anonymous'}
                                    </Typography>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                            {formatThaiDate(new Date())}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                            follower: {followerCount}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Divider />

                        {/* บทความที่เลือกแชร์ */}
                        <Box sx={{ m: "2rem 0", }}>
                            {(log?.Article || "").split('\n').map((line, index) => (
                                <Typography
                                    key={index}
                                    onClick={() => handleSelectLine(line)}
                                    sx={{
                                        cursor: 'pointer',
                                        backgroundColor: selectedLines.includes(line) ? '#4D8A65' : 'transparent',
                                        color: selectedLines.includes(line) ? 'white' : 'black',
                                        borderRadius: '4px',

                                        padding: "0 1rem", // Optional padding
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    {renderArticleText(line)}
                                </Typography>
                            ))}
                        </Box>
                        <Divider />
                        <Box sx={{ marginTop: "0.5rem", }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Typography sx={{ ...textStyle, color: "#aaa", fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                    {log?.User?.Username} ✧*:･ﾟ
                                </Typography>
                                <Typography sx={{ ...textStyle, marginLeft: '0.4rem', color: "#aaa", fontSize: { xs: '0.8rem', md: '1rem' }, whiteSpace: 'nowrap' }}>
                                    {log?.CreatedAt ? formatThaiDate(log.CreatedAt) : 'Date not available'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* log content */}
                <Box sx={{ padding: { xs: '1rem', md: '2rem' }, maxWidth: { xs: "90%", md: '800px' }, minWidth: { xs: "90%", md: "800px" }, margin: '0 auto' }} onClick={(e) => e.stopPropagation()}>
                    <Paper
                        id="log-content"
                        elevation={3}
                        sx={{
                            padding: '2rem',
                            marginTop: '1rem',
                            position: 'relative',
                            maxWidth: '100%', // ให้ขนาดไม่เกินขนาดหน้าจอ
                            overflow: 'hidden', // ป้องกันการ overflow
                        }}
                    >
                        {/* ปุ่ม Like และ Save */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                            }}
                        >
                            <Stack direction="column" alignItems="center" spacing={0}>
                                <IconButton >
                                    <ThumbUpOffAltIcon sx={{ color: "#E36951" }} />
                                </IconButton>
                                <Typography sx={{ marginTop: "-8px", justifyContent: "center" }}>{log?.LikesCount}</Typography>
                            </Stack>
                            <Stack direction="column" alignItems="center" spacing={0}>
                                <IconButton >
                                    <BookmarkBorderIcon sx={{ color: "#3DB068" }} />
                                </IconButton>
                                <Typography sx={{ marginTop: "-8px", justifyContent: "center" }}>{log?.SavesCount}</Typography>
                            </Stack>
                        </Box>

                        {/* Header */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: { xs: 'flex-start', md: 'space-between' },
                                alignItems: { xs: 'flex-start', md: 'center' },
                                marginTop: "1.6rem",
                                marginBottom: "1rem",
                                padding: { xs: 1, md: 2 },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // maxWidth: '65%'
                                }}>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                        fontWeight: 'bold',
                                        marginBottom: { xs: '1rem', md: 0 },
                                        flex: 1, // Make sure the title takes available space
                                        maxWidth: "100%",
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        textAlign: 'left',
                                    }}
                                >
                                    {log?.Title}
                                </Typography>
                                {Object.entries(categories)
                                    .filter(([category, { ID }]) => ID === log?.CategoryID)  // Filter where ID matches log?.MoodID
                                    .map(([mood, { ID, Name, Icon }]) => (
                                        <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Box sx={{ display: "flex", alignItems: 'center', color: "#6C757D", }}>
                                                {Icon}</Box> {/* Display Icon */}
                                            < Box sx={{ color: "#6C757D", fontSize: { xs: '0.8rem', md: '1rem' } }}>{Name}</Box> {/* Display Name */}
                                        </div>
                                    ))
                                }
                            </Box>
                            <Box
                                sx={{
                                    mt: "1rem",
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: "center", // Align items vertically centered
                                    justifyContent: "center", // Center horizontally
                                    gap: 2,
                                    minWidth: "30%",
                                    height: "100%", // Make sure height is set appropriately
                                }}
                            >
                                <Avatar
                                    src={userLogo}
                                    alt={log?.User?.Username || 'User'}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: '50%', // Ensure the avatar is circular
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start', // Keep this for text alignment
                                    }}
                                >
                                    <Typography variant="h6">
                                        {log?.User?.Username || 'Anonymous'}
                                    </Typography>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                            {formatThaiDate(new Date())}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                            follower: {followerCount}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Divider />

                        {/* บทความที่เลือกแชร์ */}
                        <Box sx={{ m: "2rem 0", }}>
                            {selectedLines.length > 0 ? (
                                <Box>
                                    {/* แสดงผลเฉพาะบรรทัดที่เลือก */}
                                    {selectedLines.map((line, index) => (
                                        <Typography
                                            key={index}
                                            sx={{
                                                marginBottom: '0.5rem',
                                                padding: "0.1rem 1rem"
                                            }}
                                        >
                                            {renderArticleText(line)}
                                        </Typography>
                                    ))}
                                </Box>
                            ) : (
                                // กรณีที่ไม่มีบรรทัดที่เลือก
                                <Typography variant="body1" sx={{ marginBottom: '0.5rem', padding: "0.1rem 1rem" }}>
                                    {renderArticleText(log?.Article)}
                                </Typography>
                            )}
                        </Box>
                        <Divider />
                        <Box sx={{ marginTop: "0.5rem", }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Typography sx={{ ...textStyle, color: "#aaa", fontSize: { xs: '0.8rem', md: '1rem' } }}>
                                    {log?.User?.Username} ✧*:･ﾟ
                                </Typography>
                                <Typography sx={{ ...textStyle, marginLeft: '0.4rem', color: "#aaa", fontSize: { xs: '0.8rem', md: '1rem' }, whiteSpace: 'nowrap' }}>
                                    {log?.CreatedAt ? formatThaiDate(log.CreatedAt) : 'Date not available'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: "1rem", justifyContent: "center" }}>
                    <LineSelectorButton
                        onClick={clearSelectedLines}
                        sx={{
                            backgroundColor: "#E36951",
                            '&:hover': {
                                width: '108px', // Expands on hover
                                paddingRight: '14px', // Adds space for the text on hover
                                backgroundColor: "#E36951",
                                color: '#F5FFFC',
                                boxShadow: "2px 4px 6px rgba(1, 27, 10, 0.3), -2px -4px 6px rgba(255, 255, 255, 0.4)",
                            },
                        }}>
                        <ClearAllIcon />
                        <span className="button-label">Clear</span>
                    </LineSelectorButton>
                    <LineSelectorButton
                        onClick={handleShareAsImage}
                        sx={{
                            '&:hover': {
                                width: '116px', // Expands on hover
                                paddingRight: '14px', // Adds space for the text on hover
                                backgroundColor: '#4D8A65',
                                color: '#F5FFFC',
                                boxShadow: "2px 4px 6px rgba(1, 27, 10, 0.3), -2px -4px 6px rgba(255, 255, 255, 0.4)",
                            },
                        }}>
                        <ShareIcon />
                        <span className="button-label">Share</span>
                    </LineSelectorButton>
                </Box>
            </Box>
        </Modal>
    );
}

export default LineSelectorModal;
