import { createTheme } from "@mui/material/styles";
import blueGrey from "@mui/material/colors/blueGrey";
import { useMemo } from 'react';
import { css } from '@emotion/css';
import { useTheme } from '@emotion/react';

const TimerTheme = createTheme({
    typography: {
        fontFamily: ["Fira Code"].join(",")
    },
    status: {
        scroll: blueGrey[50],
        play: "#089c8c",
        pause: "#f77452"
    },
    overrides: {
        MuiCssBaseline: {
            "@global": {
                "*": {
                    "scrollbar-width": "thin"
                },
                "*::-webkit-scrollbar": {
                    width: 4,
                    height: 4,
                    backgroundColor: "transparent"
                },
                "*::-webkit-scrollbar-thumb": {
                    borderRadius: 4,
                    backgroundColor: blueGrey[100]
                },
                "*::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: blueGrey[200]
                }
            }
        }
    }
});

export const useClasses = stylesElement => {
    const theme = useTheme();
    return useMemo(() => {
        const rawClasses = typeof stylesElement === 'function'
            ? stylesElement(theme)
            : stylesElement;
        const prepared = {};

        Object.entries(rawClasses).forEach(([key, value = {}]) => {
            prepared[key] = css(value);
        });

        return prepared;
    }, [stylesElement, theme]);
};

export default TimerTheme;