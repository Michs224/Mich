#include <stdio.h>
#include <stdlib.h>

int sum(n){

    if(n<=0){
        return 0;
    }
    else if(n==1){
        return 1;
    }

    else if(n>1 && n%2!=0){
        return sum(n-1)+sum(n+1);
    }
    else{
        return sum(n/2);
    }

}

int main()
{
    int t,i,j,n;

    scanf("%d",&t);
    for(i=0;i<t;i++){
        scanf("%d",&n);
        printf("Case #%d: %d\n",i+1,sum(n));

    }
    return 0;
}
