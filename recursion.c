#include <stdio.h>

int function(int a,int x);
int main()
{
    int T,N,i,res,n,j;
    scanf("%d", &T);
    for (i=1;i<=T;i++){
        scanf("%d",&N);
        res = sum(N,j);
       
        printf("Case #%d: %d %d",i,res,j);

    
    }
}

int sum(n,x){
	if(n%3==0){
		x++;
	}
    if(n==0){
        return 1;
    }
    else if(n==1){
        return 2;
    }

    else if(n%5==0){
        return n*2;
    }
    else{
        return sum(n-1)+n+sum(n-2)+n-2;
    }
    
    

}
