public class TestStatic {
    
    public static Integer counter = 1;
    
    public static Integer incrementCounter (){
        counter++;
        System.debug('counter: ' + counter);
        return counter;
    }

}