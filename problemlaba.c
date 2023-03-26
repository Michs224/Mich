#include <stdio.h>
#include <math.h>

int main()
{
	int T;
	double a,b,c,d, aa,bb,cc,dd, aaa,bbb,ccc,ddd, ha, hb, hc, hd, ht,haa, hbb, hcc, hdd, htt,haaa, hbbb, hccc, hddd, httt;
	
	scanf("%i", &T);
	scanf("%lf %lf %lf %lf",&a,&b,&c,&d);
	scanf("%lf %lf %lf %lf",&aa,&bb,&cc,&dd);
	scanf("%lf %lf %lf %lf",&aaa,&bbb,&ccc,&ddd);
	
	ha=(a/1)*2;
	hb=(b/2)*4;
	hc=(c/3)*4;
	hd=(d/4)*2;
	
	haa=(aa/1)*2;
	hbb=(bb/2)*4;
	hcc=(cc/3)*4;
	hdd=(dd/4)*2;
	
	haaa=(aaa/1)*2;
	hbbb=(bbb/2)*4;
	hccc=(ccc/3)*4;
	hddd=(ddd/4)*2;
	
	printf("%.2lf\n",ha+hb+hc+hd);
	printf("%.2lf\n",haa+hbb+hcc+hdd);
	printf("%.2lf\n",haaa+hbbb+hccc+hddd);
	
	return (0);
}
