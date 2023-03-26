#include <stdio.h>

int main() {
	int x, y, T, i=1;
	
	scanf("%d",&T);
	
	while(i<=T)
    {
        scanf("%d %d",&x,&y);
        int count=0,c=0;
        
        while(x>0){
            count++;
            c++;
            x--;
            if(c==y)
            {
                x++;
                c=0;
            }
            
        }
        printf("Case #%d: %d\n",i,count);
        i++;
    }
  	
  
  return 0;
}
