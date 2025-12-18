import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { student } from "@/assets/icon";
export default function Container({ bgColor, title, to }) {
    const navigate = useNavigate();
    return (_jsxs("div", { style: {
            flex: 3,
            margin: "10px 20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }, children: [_jsx("div", { onClick: () => navigate(to), style: {
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: bgColor,
                    borderRadius: "5px",
                    position: "relative",
                    paddingBottom: "44%",
                }, children: _jsx("img", { src: student, alt: "icon_student", style: {
                        width: "53%",
                        height: "auto",
                        position: "absolute",
                        top: "-8px",
                        right: "50px",
                        transform: "translateX(50%)",
                    } }) }), _jsx("div", { style: {
                    paddingLeft: "10px",
                    paddingTop: "15px",
                    paddingBottom: "10px",
                    fontWeight: "bold",
                    fontSize: "20px",
                }, children: title })] }));
}
