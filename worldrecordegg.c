#include <stdio.h>

int main (){
    int m,n,i,j,a;
    int fibonnaci[m][n];

    fibonnaci[0][0]=0;
    fibonnaci[1][0]=1;
    scanf("%d",&a);

    printf("%d %d", fibonnaci[0][0],fibonnaci[1][0]);
    for (i=0;i<=a;i++){
            for(j=2;j<=a;j++){

                fibonnaci[i][j]=fibonnaci[i][j-1]+fibonnaci[i][j-2];
                printf("%d %d %d\n",i,j,fibonnaci[i][j]);
            }
    }

    return 0;
}
