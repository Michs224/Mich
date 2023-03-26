#include <stdio.h>
#include <string.h>

int main(){
    int T, N, K;
    char msg[200][200];
    char ciph[200][200];
    scanf("%d", &T);
    int i,j;
    for(i = 0; i < T; i++){
        scanf("%d %d", &N, &K);
        char a;
		scanf("%c", &a);
		scanf("%[^\n]", msg[i]);
        for(j = 0; j < strlen(msg[i]); j++){
            int c = (int)(msg[i][j] - 'a');
            char cipher = (char)(((c + K)%26) + 'a');

            ciph[i][j] = cipher;
        }
    }

    for(i = 1; i <= T; i++){
        printf("Case #%d: %s\n", i, ciph[i-1]);
    }

}
