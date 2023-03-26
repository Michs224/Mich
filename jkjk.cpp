#include <stdio.h>
#include <string.h>
int main(){
    int T, N;
    char str[100][100];
    char out[100][100];

    scanf("%d", &T);
    int i, j;
    for(i = 0; i < T; i++){
        N = scanf("%d", &N);
		char newline;
		scanf("%c", &newline);
        //fflush(stdin);
        gets(str[i]);

        int k = 0;
        for(j = 0; j < strlen(str[i]); j++){
            char c = str[i][j];
            if( (c >= 'a' && c <= 'z')){
                out[i][k] = c;
                k += 1;
            }
        }
    }
    for(i = 1; i <= T; i++){
        printf("Case #%d: %s\n", i, out[i-1]);
    }
    return 0;
}
