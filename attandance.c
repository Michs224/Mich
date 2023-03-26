#include <stdio.h>

int main() {
    int N,i,j,num[100];
    scanf("%d", &N);
 
    
    for (i = 0; i < N; i++) {
        num[i] = 0;
    }
    for (i = 0; i < N; i++) {
        for (j = 0; j < N; j++) {
            int tim;
            scanf("%d", &tim);
            if (tim > 0) {
                
                num[tim-1]++;
            }
        }
    }
    int count = 0;
    for (i = 0; i < N; i++) {
        if (num[i] < N) {
            count++;
        }
    }
    printf("%d\n", count);
    return 0;
}
