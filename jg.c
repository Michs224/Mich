#include <stdio.h>

int main (void){
int a,b,x,y;

for (x=1;x<=10;x++){
for (y=19;y>0;y--){
if  ((y>(x+9))||(x>y)){
printf (" ");
}
else if ((y>2&&y<19)&&(x>2&&x<9)){

if ((y<(x+2))){
printf ("* *             ");
}
}
else{
printf ("* ");
}
}
printf ("\n");
}
return(0);
}
