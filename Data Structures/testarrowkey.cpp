#include <stdio.h>
#include <conio.h>

int main() {
    char ch;
    while (1) {
        ch = getch();
        if (ch == 72) { // arrow up
            printf("Up arrow key pressed\n");
        } else if (ch == 75) { // arrow left
            printf("Left arrow key pressed\n");
        } else if (ch == 80) { // arrow down
            printf("Down arrow key pressed\n");
        } else if (ch == 77) { // arrow right
            printf("Right arrow key pressed\n");
        } else {
            printf("Other key pressed\n");
        }
    }
    return 0;
}


